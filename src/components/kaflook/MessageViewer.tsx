"use client";

import type * as React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { KafkaMessage } from '@/services/kafka';

interface MessageViewerProps {
  messages: KafkaMessage[];
  selectedTopic: string | null;
  isLoading: boolean;
  error: Error | null;
}

export function MessageViewer({ messages, selectedTopic, isLoading, error }: MessageViewerProps) {
  return (
    <Card className="flex-grow shadow-lg">
      <CardHeader>
        <CardTitle>Messages</CardTitle>
        <CardDescription>
            {selectedTopic ? `Showing latest messages for: ${selectedTopic}` : 'Select a topic to view messages.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] border rounded-md p-4 bg-secondary/20">
          {isLoading ? (
            <div className="space-y-2">
               {Array.from({ length: 8 }).map((_, i) => (
                 <Skeleton key={i} className="h-6 w-full rounded-md" />
               ))}
             </div>
          ) : error ? (
            <p className="text-destructive font-mono">Error fetching messages: {error.message}</p>
          ) : !selectedTopic ? (
             <p className="text-muted-foreground font-mono">Please select a topic from the list.</p>
          ) : messages.length === 0 ? (
            <p className="text-muted-foreground font-mono">No messages found for this topic.</p>
          ) : (
            <pre className="text-sm font-mono whitespace-pre-wrap break-words">
              {messages.map((msg, index) => (
                <div key={index} className="mb-2 p-2 bg-card rounded">
                  {msg.content}
                </div>
              ))}
            </pre>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
