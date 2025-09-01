"use client";

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { getAiSuggestions } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from './ui/skeleton';

export function AiSuggestions() {
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    setSuggestions([]);
    try {
      const result = await getAiSuggestions();
      setSuggestions(result.projectSuggestions);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-accent/50 border-accent">
      <CardHeader>
        <div className="flex items-center gap-3">
            <div className="p-2 bg-accent rounded-full">
                <Wand2 className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
                <CardTitle className='font-headline'>AI Project Suggestions</CardTitle>
                <CardDescription>Based on your creative activity</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 && !isLoading && (
            <div className='text-center space-y-4'>
                <p className='text-sm text-muted-foreground'>Click the button to get some fresh ideas for your next project!</p>
                <Button onClick={handleGetSuggestions} disabled={isLoading}>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Get Ideas
                </Button>
            </div>
        )}

        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-5/6" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-4/6" />
          </div>
        )}
        
        {suggestions.length > 0 && (
          <div className="space-y-3">
            <ul className="list-disc list-inside space-y-2 text-sm">
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
             <Button onClick={handleGetSuggestions} disabled={isLoading} variant="outline" className='mt-4 w-full'>
                <Wand2 className="mr-2 h-4 w-4" />
                Get New Ideas
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
