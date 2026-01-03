
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';

// Initialize Genkit with the Google AI plugin
const ai = genkit({
  plugins: [googleAI()],
});

// Valid allergen IDs
const validAllergenIds = [
  'gluten', 'leche', 'huevos', 'frutos_de_cascara', 'pescado', 'crustaceos',
  'soja', 'cacahuetes', 'mostaza', 'sesamo', 'apio', 'sulfitos', 'moluscos', 'altramuces'
] as const;

type AllergenId = typeof validAllergenIds[number];

// Schema for a detected menu item
const DetectedMenuItemSchema = z.object({
  name_i18n: z.object({
    es: z.string(),
    en: z.string(),
  }),
  description_i18n: z.object({
    es: z.string().optional(),
    en: z.string().optional(),
  }).optional(),
  category: z.string(),
  price: z.number(),
  allergens: z.array(z.enum(validAllergenIds)),
});

// Quality issue types
const QualityIssueSchema = z.enum(['blurry', 'dark', 'too_long', 'unreadable', 'no_text']);

// Output schema for the analysis
const MenuAnalysisOutputSchema = z.object({
  success: z.boolean(),
  qualityIssue: QualityIssueSchema.optional(),
  items: z.array(DetectedMenuItemSchema),
  detectedCategories: z.array(z.string()),
});

export type MenuAnalysisResult = z.infer<typeof MenuAnalysisOutputSchema>;
export type DetectedMenuItem = z.infer<typeof DetectedMenuItemSchema>;

// Input schema
const MenuPhotoInputSchema = z.object({
  imageBase64: z.string().describe('Base64 encoded image of the menu'),
});

/**
 * Analyzes a menu photo and extracts structured data
 * CRITICAL: Only extracts TEXT from the menu, ignores food photos
 */
export const analyzeMenuPhotoFlow = ai.defineFlow(
  {
    name: 'analyzeMenuPhotoFlow',
    inputSchema: MenuPhotoInputSchema,
    outputSchema: MenuAnalysisOutputSchema,
  },
  async ({ imageBase64 }): Promise<MenuAnalysisResult> => {
    console.log('🤖 [AI] analyzeMenuPhotoFlow started. Image size:', imageBase64.length, 'chars');
    try {
      const prompt = `
Eres un experto en análisis de cartas de restaurante españoles.

**INSTRUCCIONES CRÍTICAS:**
1. **SOLO EXTRAE TEXTO**: Ignora completamente las fotos de comida que puedas ver. NO intentes descifrar qué plato es por la imagen.
2. **NO INVENTES NADA**: Solo lee el texto visible y organízalo. Si no hay texto, devuelve error.
3. **VALIDACIÓN DE CALIDAD**: Antes de analizar, evalúa:
   - ¿El texto es legible? (Si >30% es borroso → "blurry")
   - ¿Hay suficiente luz? (Si está muy oscura → "dark")
   - ¿Cuántos platos hay? (Si >30 platos → "too_long")
   - ¿Hay texto visible? (Si no hay texto → "no_text")

**SI HAY PROBLEMAS DE CALIDAD**, devuelve:
{
  "success": false,
  "qualityIssue": "blurry" | "dark" | "too_long" | "no_text",
  "items": [],
  "detectedCategories": []
}

**SI LA CALIDAD ES BUENA**, extrae la información:

Para cada plato visible en el TEXTO:
1. **Nombre**: Exactamente como aparece escrito
2. **Descripción**: Solo si hay ingredientes o detalles escritos
3. **Categoría**: Clasifica en: Entrantes, Ensaladas, Principales, Carnes, Pescados, Arroces, Pasta, Pizzas, Postres, Bebidas, etc.
4. **Precio**: En euros (número). Si no hay precio visible, usa 0
5. **Alérgenos**: Basándote SOLO en los ingredientes mencionados en el texto

**DETECCIÓN DE ALÉRGENOS** (solo si están en los ingredientes):
- gluten: pan, pasta, rebozados, cerveza, harina de trigo
- leche: queso, nata, mantequilla, bechamel, yogur
- huevos: mayonesa, salsa césar, tortilla, rebozados
- frutos_de_cascara: nueces, almendras, avellanas, pistachos
- pescado: cualquier pescado, anchoas, atún
- crustaceos: gambas, langostinos, cangrejo, bogavante
- soja: salsa de soja, tofu, edamame
- cacahuetes: cacahuetes, salsa satay
- mostaza: mostaza, salsa mostaza
- sesamo: sésamo, tahini
- apio: apio
- sulfitos: vino, vinagre
- moluscos: mejillones, almejas, pulpo, sepia, calamares
- altramuces: altramuces

**TRADUCCIÓN AL INGLÉS**:
- Traduce de forma natural y gastronómica, NO literal
- Ejemplos:
  ✅ "Croquetas de jamón" → "Ham Croquettes"
  ✅ "Pulpo a la gallega" → "Galician-Style Octopus"
  ✅ "Ensalada mixta" → "Mixed Salad"
  ❌ "Patatas bravas" → "Brave Potatoes" (INCORRECTO)
  ✅ "Patatas bravas" → "Spicy Potatoes"

**FORMATO DE SALIDA** (SOLO JSON, sin texto adicional):
{
  "success": true,
  "items": [
    {
      "name_i18n": {
        "es": "Ensalada César",
        "en": "Caesar Salad"
      },
      "description_i18n": {
        "es": "Lechuga, pollo, parmesano, salsa césar",
        "en": "Lettuce, chicken, parmesan, caesar dressing"
      },
      "category": "Ensaladas",
      "price": 8.50,
      "allergens": ["gluten", "leche", "huevos", "pescado"]
    }
  ],
  "detectedCategories": ["Ensaladas", "Principales", "Postres"]
}

**IMPORTANTE**: 
- Si un plato no tiene descripción, omite "description_i18n"
- Si no puedes determinar alérgenos con certeza, devuelve array vacío []
- **CATEGORÍAS**: Respeta EXACTAMENTE las categorías que aparecen en la carta original (ej: "Entrantes", "Principales", "Postres", "Bebidas", etc.)
- Si la carta tiene secciones claramente marcadas (títulos, separadores, etc.), úsalas como categorías
- NO inventes categorías genéricas si la carta ya tiene las suyas propias
- Mantén el orden visual de la carta y agrupa los platos según aparecen bajo cada sección

Ahora analiza esta imagen de carta:
      `.trim();

      // Call Gemini Vision API
      console.log('[AI] Calling Gemini 2.5 Flash...');
      const { text } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash'),
        prompt: [
          { text: prompt },
          {
            media: {
              contentType: 'image/jpeg',
              url: `data:image/jpeg;base64,${imageBase64}`
            }
          }
        ],
        config: {
          temperature: 0.1, // Low temperature for consistent extraction
        },
      });
      console.log('🤖 [AI] Gemini response received. Length:', text?.length || 0);
      console.log('🤖 [AI] Gemini raw response:', text?.substring(0, 500));

      // Extract JSON from response
      console.log('🤖 [AI] Extracting JSON from response...');
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('❌ [AI] No JSON found in Gemini response!');
        console.error('❌ [AI] Full response:', text);
        return {
          success: false,
          qualityIssue: 'unreadable',
          items: [],
          detectedCategories: [],
        };
      }

      const jsonString = jsonMatch[0];
      console.log('🤖 [AI] JSON extracted:', jsonString.substring(0, 200));
      const parsedOutput = JSON.parse(jsonString);
      console.log('🤖 [AI] JSON parsed successfully');

      // Validate with Zod
      console.log('🤖 [AI] Validating with Zod schema...');
      const result = MenuAnalysisOutputSchema.parse(parsedOutput);
      console.log('🤖 [AI] Zod validation passed');

      // If quality issue detected, return early
      if (!result.success) {
        console.log(`[menuPhotoAnalysis] Quality issue detected: ${result.qualityIssue}`);
        return result;
      }

      // Normalize allergens (ensure lowercase, filter invalid)
      const normalizedItems = result.items.map(item => ({
        ...item,
        allergens: item.allergens
          .map(a => a.toLowerCase())
          .filter((a): a is AllergenId =>
            (validAllergenIds as readonly string[]).includes(a)
          ),
      }));

      console.log(`[menuPhotoAnalysis] Successfully analyzed ${normalizedItems.length} items`);

      return {
        success: true,
        items: normalizedItems,
        detectedCategories: result.detectedCategories,
      };

    } catch (error) {
      console.error('❌ [AI] CRITICAL ERROR during analysis:', error);
      console.error('❌ [AI] Error type:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('❌ [AI] Error message:', error instanceof Error ? error.message : String(error));
      console.error('❌ [AI] Error stack:', error instanceof Error ? error.stack : 'No stack');

      // Return safe default on any error
      return {
        success: false,
        qualityIssue: 'unreadable',
        items: [],
        detectedCategories: [],
      };
    }
  }
);

/**
 * Get user-friendly error message for quality issues
 */
export function getQualityIssueMessage(issue: string): string {
  const messages: Record<string, string> = {
    blurry: 'Ups, no he podido leer bien la carta. ¿Puedes intentar hacer la foto con más luz o más cerca?',
    dark: 'La imagen está muy oscura. Intenta hacer la foto con mejor iluminación.',
    too_long: '¡Vaya carta más completa! Para mejores resultados, sube la carta por secciones (entrantes, principales, postres...).',
    unreadable: 'No he podido detectar texto legible. Asegúrate de que la foto esté enfocada y el texto sea visible.',
    no_text: 'No he encontrado texto en la imagen. Asegúrate de subir una foto de tu carta con los platos escritos.',
  };

  return messages[issue] || 'Ha ocurrido un error al analizar la imagen. Por favor, inténtalo de nuevo.';
}

/**
 * Get suggestions for improving image quality
 */
export function getQualityIssuesugestions(issue: string): string[] {
  const suggestions: Record<string, string[]> = {
    blurry: [
      'Mantén el móvil firme al hacer la foto',
      'Acerca más la cámara al texto',
      'Asegúrate de que la cámara enfoque correctamente',
    ],
    dark: [
      'Usa luz natural o enciende más luces',
      'Evita sombras sobre la carta',
      'Aumenta el brillo de la pantalla si es una carta digital',
    ],
    too_long: [
      'Divide la carta en secciones (entrantes, principales, postres)',
      'Sube una foto por cada página de la carta',
      'Enfócate en una categoría a la vez',
    ],
    unreadable: [
      'Asegúrate de que el texto sea legible',
      'Limpia la lente de la cámara',
      'Evita reflejos y brillos en la carta',
    ],
    no_text: [
      'Verifica que estás subiendo una foto de la carta',
      'Asegúrate de que el texto sea visible en la imagen',
      'Evita fotos de solo platos de comida',
    ],
  };

  return suggestions[issue] || [
    'Intenta con mejor iluminación',
    'Asegúrate de que el texto sea legible',
    'Sube la carta por secciones si es muy larga',
  ];
}
