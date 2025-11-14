import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';

// Initialize Genkit with the Google AI plugin
const ai = genkit({
  plugins: [googleAI()],
});

// The list of valid allergen IDs that the AI can return
const validAllergenIds = [
  'gluten', 'leche', 'huevos', 'frutos_de_cascara', 'pescado', 'crustaceos', 
  'soja', 'cacahuetes', 'mostaza', 'sesamo', 'apio', 'sulfitos', 'moluscos', 'altramuces'
];

// Define the Zod schema for the expected output
const AllergenOutputSchema = z.object({
  allergens: z.array(z.string()).describe('An array of allergen IDs present in the dish.'),
});

// Define the allergen detection flow
export const detectAllergensFlow = ai.defineFlow(
  {
    name: 'detectAllergensFlow',
    inputSchema: z.string().describe('The name of the dish to analyze.'),
    outputSchema: AllergenOutputSchema,
  },
  async (dishName) => {
    const prompt = `
      You are an expert food allergen detector for a Spanish restaurant.
      Your task is to identify all possible allergens in a given dish name, considering common Spanish culinary interpretations and regional variations, and return ONLY a valid JSON object.
      The dish name is: "${dishName}".

      Analyze the dish name and identify which of the following official Spanish allergen IDs are present.
      The only valid allergens you can output are from this list:
      ${validAllergenIds.join(', ')}.
      If a term in the dish name has multiple common interpretations in Spanish cuisine with different allergen profiles, please prioritize the interpretation that includes more potential allergens to ensure safety.

      Your response MUST be ONLY the JSON object itself, with no other text, explanations, or markdown formatting.
      The JSON object must have a single key "allergens", which is an array of strings. Each string in the array must be one of the valid allergen IDs.

      Correct example for "Pastel de queso y nueces":
      {
        "allergens": ["leche", "gluten", "huevos", "frutos_de_cascara"]
      }
      
      Another example for "Salteado de espárragos con huevo poche y jamón":
      {
        "allergens": ["huevos"]
      }

      If there are no allergens from the list, or you are unsure, return an empty array:
      {
        "allergens": []
      }

      Now, analyze the dish: "${dishName}".
    `;

    const { text } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash'),
      prompt: prompt,
    });

    try {
      // Find and extract the JSON part of the response
      const jsonMatch = text.match(/\{.*\}/s);
      if (!jsonMatch) {
        throw new Error("No JSON object found in the AI response.");
      }
      const jsonString = jsonMatch[0];
      const parsedOutput = JSON.parse(jsonString);
      return AllergenOutputSchema.parse(parsedOutput);
    } catch (e) {
      console.error("Failed to parse or validate AI output:", e, "Raw AI output:", text);
      // Return a safe default in case of error
      return { allergens: [] };
    }
  }
);
