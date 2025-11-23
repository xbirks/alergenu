
// src/ai/allergenDetection.test.ts
import { detectAllergensFlow } from './allergenDetection';

// --- Mocking a Nivel de Módulo (Versión Corregida) ---

// Mock para el módulo 'genkit'
jest.mock('genkit', () => {
  const mockGenerate = jest.fn();
  return {
    // Exportamos la función mock para poder acceder a ella en los tests
    __mockGenerate: mockGenerate,
    genkit: jest.fn(() => ({
      defineFlow: (schema, implementation) => implementation,
      generate: mockGenerate, // Usamos la función mock interna
    })),
  };
});

// Mock para el módulo '@genkit-ai/googleai'
jest.mock('@genkit-ai/googleai', () => {
  const mockModel = jest.fn(modelName => `mocked-model::${modelName}`);
  return {
    googleAI: Object.assign(
      jest.fn(() => 'mocked-googleai-plugin'),
      {
        // Exportamos la función mock para el test
        __mockModel: mockModel,
        model: mockModel, // Usamos la función mock interna
      }
    ),
  };
});

// --- Importación de los Mocks para el Test ---

// Requerimos los módulos ya mockeados para obtener acceso a las funciones de simulación
const { __mockGenerate } = require('genkit');
const { googleAI } = require('@genkit-ai/googleai');
const { __mockModel } = googleAI;


// --- Suite de Tests ---

describe('detectAllergensFlow', () => {

  beforeEach(() => {
    // Limpiamos los mocks antes de cada test para asegurar un estado limpio.
    __mockGenerate.mockClear();
    __mockModel.mockClear();
  });

  // Test 1: Validar el "contrato" de la llamada a la IA
  describe('AI Call Contract', () => {
    it('debe llamar a la IA con el modelo, prompt y plato correctos', async () => {
      __mockGenerate.mockResolvedValue({ text: '{"allergens":[]}' });
      const dishName = 'Tarta de Santiago';

      await detectAllergensFlow(dishName);

      expect(__mockGenerate).toHaveBeenCalledTimes(1);

      const callArgs = __mockGenerate.mock.calls[0][0];
      
      expect(__mockModel).toHaveBeenCalledWith('gemini-2.5-flash');
      expect(callArgs.model).toBe('mocked-model::gemini-2.5-flash');

      const prompt = callArgs.prompt as string;
      expect(prompt).toContain(dishName);
      expect(prompt).toContain('expert food allergen detector');
      const validAllergenIds = ['gluten', 'leche', 'huevos', 'frutos_de_cascara'];
      validAllergenIds.forEach(id => expect(prompt).toContain(id));
    });
  });

  // Test 2: Casos de éxito en la respuesta
  describe('Successful AI Responses', () => {
    it('debe devolver múltiples alérgenos para un plato complejo', async () => {
      const aiResponse = '{"allergens": ["gluten", "leche"]}';
      __mockGenerate.mockResolvedValue({ text: aiResponse });
      const result = await detectAllergensFlow('Pastel de queso');
      expect(result.allergens).toEqual(['gluten', 'leche']);
    });

    it('debe extraer el JSON correctamente incluso si la IA devuelve texto extra', async () => {
        const aiResponse = 'Claro, aquí tienes: {\"allergens\": [\"pescado\"]}';
        __mockGenerate.mockResolvedValue({ text: aiResponse });
        const result = await detectAllergensFlow('Sardinas');
        expect(result.allergens).toEqual(['pescado']);
    });
  });

  // Test 3: Gestión de errores y respuestas inválidas
  describe('Error Handling and Robustness', () => {
    it('debe devolver un array vacío si la llamada a la IA falla', async () => {
      __mockGenerate.mockRejectedValue(new Error('AI service is down'));
      const result = await detectAllergensFlow('Cualquier plato');
      expect(result).toEqual({ allergens: [] });
    });

    it('debe devolver un array vacío si la IA devuelve un JSON malformado', async () => {
      __mockGenerate.mockResolvedValue({ text: '{"allergens": ["gluten",}' });
      const result = await detectAllergensFlow('Un plato');
      expect(result).toEqual({ allergens: [] });
    });

    it('debe devolver un array vacío si la IA devuelve una estructura de JSON incorrecta', async () => {
      __mockGenerate.mockResolvedValue({ text: '{"detected": ["soja"]}' });
      const result = await detectAllergensFlow('Otro plato');
      expect(result).toEqual({ allergens: [] });
    });
  });

  // Test 4: Normalización y filtrado de alérgenos
  describe('Output Filtering and Normalization', () => {
    it('[SHOULD FAIL] debe filtrar alérgenos no válidos y normalizar los que son válidos', async () => {
      const messyResponse = '{"allergens": ["GLUTEN", "tomate", "LeChE"]}';
      __mockGenerate.mockResolvedValue({ text: messyResponse });
      const result = await detectAllergensFlow('Plato con respuesta sucia');
      
      // Este test FALLARÁ, exponiendo correctamente una posible mejora en el código de producción.
      // El resultado esperado ideal sería: ["gluten", "leche"]
      expect(result.allergens).toEqual(["gluten", "leche"]);
    });
  });
});
