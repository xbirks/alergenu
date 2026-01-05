/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { headers } from 'next/headers';

// --- Mocks de Stripe y Firebase, hoisting-safe ---

jest.mock('stripe', () => {
  const constructEvent = jest.fn();
  const retrieve = jest.fn().mockResolvedValue({
    current_period_end: 1735689600,
    items: {
      data: [
        {
          price: {
            id: 'price_autonomia_default'
          }
        }
      ]
    }
  });

  // Mock de la clase Stripe
  const StripeMock = jest.fn().mockImplementation(() => ({
    webhooks: { constructEvent },
    subscriptions: { retrieve },
  }));

  // Exponemos los mocks para usarlos en los tests
  return Object.assign(StripeMock, {
    __mocks: { constructEvent, retrieve },
  });
});

jest.mock('@/lib/firebase/firebase-admin', () => {
  const update = jest.fn();
  const get = jest.fn(() => Promise.resolve({ empty: true, docs: [] })); // Default find no user
  const where = jest.fn(() => ({ get }));
  const doc = jest.fn(() => ({ update }));
  const collection = jest.fn(() => ({ doc, where }));


  return {
    getAdminDb: () => ({
      collection,
    }),
    __mocks: { collection, doc, update, where, get },
  };
});

// Mock de next/headers
jest.mock('next/headers', () => ({
  headers: jest.fn(),
}));

// --- Recuperamos los mocks exportados por los módulos mockeados ---

// Stripe
const StripeModule = require('stripe');
const { __mocks: stripeMocks } = StripeModule as any;
const mockConstructEvent: jest.Mock = stripeMocks.constructEvent;
const mockSubscriptionsRetrieve: jest.Mock = stripeMocks.retrieve;

// Firebase
const FirebaseAdminModule = require('@/lib/firebase/firebase-admin');
const { __mocks: firebaseMocks } = FirebaseAdminModule as any;
const mockCollection: jest.Mock = firebaseMocks.collection;
const mockDoc: jest.Mock = firebaseMocks.doc;
const mockUpdate: jest.Mock = firebaseMocks.update;
const mockWhere: jest.Mock = firebaseMocks.where;
const mockGet: jest.Mock = firebaseMocks.get;


// headers()
const mockedHeaders = headers as unknown as jest.Mock;

// --- Importamos la ruta **después** de configurar todos los mocks ---

const { POST } = require('../route') as { POST: (req: NextRequest) => Promise<Response> };

// --- Helper para Requests ---

function createMockRequest(body: string, signature: string | null): NextRequest {
  mockedHeaders.mockReturnValue(new Map([['stripe-signature', signature]]));
  return new NextRequest('http://localhost/api/stripe/webhook', {
    method: 'POST',
    body,
  });
}

// --- Fixtures de Eventos de Stripe ---

const checkoutCompletedEvent = {
  id: 'evt_123',
  type: 'checkout.session.completed',
  data: {
    object: {
      id: 'cs_123',
      object: 'checkout.session',
      customer: 'cus_123456789',
      subscription: 'sub_123456789',
      metadata: {
        firebaseUID: 'test-firebase-uid'
      },
    },
  },
};

const subscriptionDeletedEvent = {
  id: 'evt_456',
  type: 'customer.subscription.deleted',
  data: {
    object: {
      id: 'sub_123456789',
      object: 'subscription',
      customer: 'cus_123456789',
    },
  },
};

// --- Suite de tests ---

describe('Stripe Webhook Endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Tests de Seguridad ---
  describe('Security & Signature Verification', () => {
    it('debe devolver 400 si la firma del webhook es inválida', async () => {
      mockConstructEvent.mockImplementation(() => { throw new Error('Invalid signature'); });

      const req = createMockRequest('{"type":"any.event"}', 'invalid-signature');
      const response = await POST(req);
      const jsonResponse = await response.json();

      expect(response.status).toBe(400);
      expect(jsonResponse.error).toContain('Webhook Error: Invalid signature');
      expect(mockCollection).not.toHaveBeenCalled();
    });
  });

  // --- Tests de Lógica de Negocio ---
  describe('Business Logic', () => {
    it('debe activar la suscripción cuando se recibe checkout.session.completed', async () => {
      mockConstructEvent.mockReturnValue(checkoutCompletedEvent);
      mockSubscriptionsRetrieve.mockResolvedValue({
        current_period_end: 1672531199,
        items: {
          data: [
            {
              price: {
                id: 'price_autonomia_default'
              }
            }
          ]
        }
      }); // 2022-12-31

      const req = createMockRequest(JSON.stringify(checkoutCompletedEvent), 'valid-signature');
      const response = await POST(req);

      expect(response.status).toBe(200);
      expect(mockCollection).toHaveBeenCalledWith('restaurants');
      expect(mockDoc).toHaveBeenCalledWith('test-firebase-uid');
      expect(mockUpdate).toHaveBeenCalledWith({
        stripeCustomerId: 'cus_123456789',
        stripeSubscriptionId: 'sub_123456789',
        subscriptionStatus: 'active',
        selectedPlan: 'autonomia',
        currentPeriodEnd: new Date(1672531199 * 1000),
      });
    });

    it('debe cancelar la suscripción cuando se recibe customer.subscription.deleted', async () => {
      // 1. Setup: Simula que encontramos un usuario con ese ID de cliente de Stripe
      // El objeto mock debe simular un DocumentSnapshot de Firestore, que tiene una propiedad `ref`.
      const mockUserDoc = {
        id: 'found-user-uid',
        ref: { update: mockUpdate }, // Simula la referencia al documento con la función de update
      };
      mockGet.mockResolvedValue({ empty: false, docs: [mockUserDoc] });

      // 2. Action: Envía el evento de cancelación
      mockConstructEvent.mockReturnValue(subscriptionDeletedEvent);
      const req = createMockRequest(JSON.stringify(subscriptionDeletedEvent), 'valid-signature');
      const response = await POST(req);

      // 3. Assertions
      expect(response.status).toBe(200);

      // Verifica que se buscó al usuario por su customerId
      expect(mockCollection).toHaveBeenCalledWith('restaurants');
      expect(mockWhere).toHaveBeenCalledWith('stripeCustomerId', '==', 'cus_123456789');

      // Verifica que se llamó a la función de actualización en el documento encontrado
      expect(mockUpdate).toHaveBeenCalledWith({
        subscriptionStatus: 'canceled',
      });
      // Nos aseguramos de que mockDoc no se llama en este flujo
      expect(mockDoc).not.toHaveBeenCalled();
    });
  });
});
