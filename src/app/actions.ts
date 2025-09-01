"use server";

import { suggestProjectPrompts } from "@/ai/flows/ai-suggested-project-prompts";
import type { SuggestProjectPromptsOutput } from "@/ai/flows/ai-suggested-project-prompts";

export async function getAiSuggestions(): Promise<SuggestProjectPromptsOutput> {
  // In a real application, you would fetch the current user's actual data.
  // For this demo, we're using mock data representing a user's interests.
  const mockUserInput = {
    userPosts: `
      - "Finished my latest watercolor of a castle by the sea."
      - "Experimenting with some abstract forms and our theme colors."
      - "My first attempt at pottery. It's a bit wobbly, but it's mine!"
    `,
    userLikes: `
      - A post about oil painting techniques for landscapes.
      - A photo of a hand-thrown ceramic vase.
      - A tutorial on mixing colors for watercolor painting.
    `,
  };

  try {
    const suggestions = await suggestProjectPrompts(mockUserInput);
    return suggestions;
  } catch (error) {
    console.error("Error fetching AI suggestions:", error);
    // You might want to throw a more specific error or handle it differently
    throw new Error("Failed to get AI suggestions.");
  }
}
