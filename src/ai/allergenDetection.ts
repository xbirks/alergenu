
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';

// Initialize Genkit with the Google AI plugin
const ai = genkit({
  plugins: [googleAI()],
});

// The list of valid allergen IDs that the AI can return.
// Using `as const` allows TypeScript to treat these as literal types, not just strings.
const validAllergenIds = [
  'gluten', 'leche', 'huevos', 'frutos_de_cascara', 'pescado', 'crustaceos', 
  'soja', 'cacahuetes', 'mostaza', 'sesamo', 'apio', 'sulfitos', 'moluscos', 'altramuces'
] as const;

// A type derived from the array above, representing a single valid allergen ID.
type AllergenId = typeof validAllergenIds[number];

// Define the Zod schema for the initial, raw output from the AI.
const RawAllergenOutputSchema = z.object({
  allergens: z.array(z.string()).describe('An array of allergen IDs present in the dish.'),
});

// Define the final, validated output schema of our flow.
const ValidatedAllergenOutputSchema = z.object({
    allergens: z.array(z.enum(validAllergenIds))
});

// Define the allergen detection flow
export const detectAllergensFlow = ai.defineFlow(
  {
    name: 'detectAllergensFlow',
    inputSchema: z.string().describe('The name of the dish to analyze.'),
    // The final output is an array of our specific, validated AllergenId types.
    outputSchema: z.object({ allergens: z.array(z.enum(validAllergenIds)) }), 
  },
  async (dishName): Promise<{ allergens: AllergenId[] }> => {
    // A single, all-encompassing try/catch block to handle ANY error during the process.
    try {
      const prompt = `
        You are an expert food allergen detector for a Spanish restaurant.
        Your task is to identify all possible allergens in a given dish name and return ONLY a valid JSON object.
        The dish name is: "${dishName}".

        Analyze the dish name and identify which of the following official Spanish allergen IDs are present.
        The only valid allergens you can output are from this list:
        ${validAllergenIds.join(', ')}.

        Your response MUST be ONLY the JSON object itself, with no other text, explanations, or markdown formatting.
        The JSON object must have a single key "allergens", which is an array of strings.

        If there are no allergens from the list, or you are unsure, return an empty array:
        {
          "allergens": []
        }

        Now, analyze the dish: "${dishName}".
      `;

      // 1. Call the AI (now safely inside the try block)
      const { text } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash'),
        prompt: prompt,
      });

      // 2. Find and extract the JSON part of the response
      const jsonMatch = text.match(/\{.*\}/s);
      if (!jsonMatch) {
        console.log('No JSON object found in AI response. Returning empty.');
        return { allergens: [] };
      }
      const jsonString = jsonMatch[0];
      const parsedOutput = JSON.parse(jsonString);

      // 3. Validate the basic structure with Zod (allows any string in the array)
      const rawParsed = RawAllergenOutputSchema.parse(parsedOutput);

      // 4. Normalize and Filter the results (the crucial new step)
      const validatedAllergens = rawParsed.allergens
        .map(allergen => allergen.trim().toLowerCase()) // Normalize to lowercase
        .filter((allergen): allergen is AllergenId => 
          (validAllergenIds as readonly string[]).includes(allergen) // Filter against the valid list
        );

      return { allergens: validatedAllergens };

    } catch (e) {
      // This single catch block handles network errors, parsing errors, validation errors, etc.
      console.error("An error occurred during the allergen detection flow:", e);
      // Return a safe, empty default in ANY error case.
      return { allergens: [] };
    }
  }
);
