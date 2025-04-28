"use client";

import type * as React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { KafkaTopic } from '@/services/kafka';

interface TopicListProps {
  topics: KafkaTopic[];
  selectedTopic: string | null;
  onSelectTopic: (topicName: string) => void;
  isLoading: boolean;
  error: Error | null;
}

export function TopicList({ topics, selectedTopic, onSelectTopic, isLoading, error }: TopicListProps) {
  return (
    <Card className="flex-shrink-0 w-full md:w-1/3 shadow-lg">
      <CardHeader>
        <CardTitle>Topics</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
             Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full mb-2 rounded-md" />
            ))
          ) : error ? (
            <p className="text-destructive">Error fetching topics: {error.message}</p>
          ) : topics.length === 0 ? (
            <p className="text-muted-foreground">No topics found for the selected environment.</p>
          ) : (
            <div className="space-y-2">
              {topics.map((topic) => (
                <Button
                  key={topic.name}
                  variant={selectedTopic === topic.name ? "default" : "secondary"}
                  onClick={() => onSelectTopic(topic.name)}
                  className="w-full justify-start text-left h-auto py-2"
                  aria-pressed={selectedTopic === topic.name}
                >
                  {topic.name}
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
