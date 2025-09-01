'use server';
/**
 * @fileOverview AI-driven project prompt suggestions based on user interests.
 *
 * - suggestProjectPrompts - A function that suggests project prompts.
 * - SuggestProjectPromptsInput - The input type for the suggestProjectPrompts function.
 * - SuggestProjectPromptsOutput - The return type for the suggestProjectPrompts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProjectPromptsInputSchema = z.object({
  userPosts: z.string().describe('The user\'s past posts and updates.'),
  userLikes: z.string().describe('The user\'s liked posts and content.'),
});
export type SuggestProjectPromptsInput = z.infer<typeof SuggestProjectPromptsInputSchema>;

const SuggestProjectPromptsOutputSchema = z.object({
  projectSuggestions: z
    .array(z.string())
    .describe('A list of project suggestions based on user interests.'),
});
export type SuggestProjectPromptsOutput = z.infer<typeof SuggestProjectPromptsOutputSchema>;

export async function suggestProjectPrompts(input: SuggestProjectPromptsInput): Promise<SuggestProjectPromptsOutput> {
  return suggestProjectPromptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProjectPromptsPrompt',
  input: {schema: SuggestProjectPromptsInputSchema},
  output: {schema: SuggestProjectPromptsOutputSchema},
  prompt: `You are a creative AI assistant designed to suggest project prompts to users based on their interests.

  Analyze the user's past posts, updates, and liked content to understand their creative preferences and suggest relevant project ideas.

  User Posts: {{{userPosts}}}
  User Likes: {{{userLikes}}}

  Based on this information, provide a list of project suggestions that align with their interests.  Return them as a list of strings in the 'projectSuggestions' field.
  The suggestions should be diverse and engaging to encourage creativity and community participation.
  Do not suggest the same suggestion twice.  Do not write introductory and closing remarks.
  `,
});

const suggestProjectPromptsFlow = ai.defineFlow(
  {
    name: 'suggestProjectPromptsFlow',
    inputSchema: SuggestProjectPromptsInputSchema,
    outputSchema: SuggestProjectPromptsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
