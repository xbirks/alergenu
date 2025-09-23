import type { Restaurant } from './types';

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'El Rincón del Sabor',
    menu: [
      {
        id: 'starters',
        name: 'Entrantes',
        items: [
          {
            id: '101',
            name: 'Ensalada César',
            description: 'Lechuga romana, aderezo César casero, picatostes y parmesano.',
            price: 9.50,
            allergens: ['gluten', 'fish', 'milk', 'eggs'],
            traces: ['mustard'],
            imageId: 'caesar-salad',
            lastUpdated: '2024-05-20T10:00:00Z',
          },
          {
            id: '102',
            name: 'Croquetas de Jamón Ibérico',
            description: 'Cremosas croquetas caseras con jamón de bellota.',
            price: 12.00,
            allergens: ['gluten', 'milk'],
            traces: ['eggs', 'soybeans'],
            imageId: 'croquetas',
            lastUpdated: '2024-05-21T11:00:00Z',
          },
          {
            id: '103',
            name: 'Gazpacho Andaluz',
            description: 'Sopa fría de tomate y verduras, refrescante y tradicional.',
            price: 8.00,
            allergens: [],
            traces: ['gluten'],
            imageId: 'gazpacho',
            lastUpdated: '2024-05-23T10:00:00Z',
          }
        ],
      },
      {
        id: 'mains',
        name: 'Platos Principales',
        items: [
          {
            id: '201',
            name: 'Paella Valenciana',
            description: 'La auténtica paella con pollo, conejo y verduras de la huerta.',
            price: 16.00,
            allergens: [],
            traces: ['molluscs', 'crustaceans'],
            imageId: 'paella-valenciana',
            lastUpdated: '2024-05-22T12:00:00Z',
          },
          {
            id: '202',
            name: 'Solomillo al Roquefort',
            description: 'Tierno solomillo de ternera con una intensa salsa de queso Roquefort.',
            price: 24.50,
            allergens: ['milk'],
            traces: ['celery', 'sulphites'],
            imageId: 'solomillo',
            lastUpdated: '2024-05-22T12:00:00Z',
          },
          {
            id: '203',
            name: 'Merluza en Salsa Verde',
            description: 'Lomos de merluza fresca en una salsa tradicional con almejas.',
            price: 21.00,
            allergens: ['fish', 'molluscs'],
            traces: ['gluten'],
            imageId: 'merluza',
            lastUpdated: '2024-05-21T09:30:00Z',
          },
           {
            id: '204',
            name: 'Cachopo Asturiano',
            description: 'Dos filetes de ternera rellenos de jamón serrano y queso.',
            price: 28.00,
            allergens: ['gluten', 'milk', 'eggs'],
            traces: [],
            imageId: 'cachopo',
            lastUpdated: '2024-05-23T14:00:00Z',
          }
        ],
      },
      {
        id: 'desserts',
        name: 'Postres',
        items: [
          {
            id: '301',
            name: 'Tarta de Queso Casera',
            description: 'Suave y cremosa tarta de queso al horno con base de galleta.',
            price: 7.50,
            allergens: ['gluten', 'eggs', 'milk'],
            traces: ['soybeans', 'tree-nuts'],
            imageId: 'cheesecake',
            lastUpdated: '2024-05-23T15:00:00Z',
          },
          {
            id: '302',
            name: 'Arroz con Leche',
            description: 'Postre tradicional asturiano, cremoso y con un toque de canela.',
            price: 6.00,
            allergens: ['milk'],
            traces: [],
            imageId: 'arroz-con-leche',
            lastUpdated: '2024-05-23T15:00:00Z',
          },
           {
            id: '303',
            name: 'Brownie de Chocolate y Nueces',
            description: 'Intenso brownie de chocolate con nueces, servido con helado de vainilla.',
            price: 8.50,
            allergens: ['gluten', 'eggs', 'milk', 'soybeans', 'tree-nuts'],
            traces: ['peanuts'],
            imageId: 'brownie',
            lastUpdated: '2024-05-24T16:00:00Z',
          }
        ],
      },
    ],
  },
];

export function getRestaurantById(id: string): Restaurant | undefined {
  return restaurants.find(r => r.id === id);
}
