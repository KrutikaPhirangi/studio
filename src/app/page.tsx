"use client";

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ConnectionStatus } from '@/components/kaflook/ConnectionStatus';
import { TopicList } from '@/components/kaflook/TopicList';
import { MessageViewer } from '@/components/kaflook/MessageViewer';
import {
  getKafkaConnectionStatus,
  getKafkaTopics,
  getKafkaMessages,
  type KafkaConnectionStatus as ConnectionStatusType,
  type KafkaTopic,
  type KafkaMessage,
} from '@/services/kafka';
import { RefreshCw, TestTubeDiagonal, Workflow } from 'lucide-react'; // Using Workflow for 'dev' and TestTubeDiagonal for 'sandbox'

const environments = [
  { value: 'dev', label: 'Development', icon: Workflow },
  { value: 'sandbox', label: 'Sandbox', icon: TestTubeDiagonal },
  // Add more environments as needed
];

const MESSAGE_COUNT = 10; // Number of messages to fetch

export default function KafLookPage() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatusType | null>(null);
  const [isConnectionLoading, setIsConnectionLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<Error | null>(null);

  const [selectedEnv, setSelectedEnv] = useState<string>(environments[0].value);
  const [topics, setTopics] = useState<KafkaTopic[]>([]);
  const [isTopicsLoading, setIsTopicsLoading] = useState(false);
  const [topicsError, setTopicsError] = useState<Error | null>(null);

  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [messages, setMessages] = useState<KafkaMessage[]>([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<Error | null>(null);

  const { toast } = useToast();

  const fetchConnectionStatus = useCallback(async () => {
    setIsConnectionLoading(true);
    setConnectionError(null);
    try {
      const status = await getKafkaConnectionStatus();
      setConnectionStatus(status);
    } catch (error) {
      console.error("Failed to fetch connection status:", error);
      setConnectionError(error instanceof Error ? error : new Error('Failed to fetch connection status'));
      setConnectionStatus({ isConnected: false }); // Assume disconnected on error
      toast({
        title: "Error",
        description: "Could not retrieve Kafka connection status.",
        variant: "destructive",
      });
    } finally {
      setIsConnectionLoading(false);
    }
  }, [toast]);

  const fetchTopics = useCallback(async (env: string) => {
    if (!env) return;
    setIsTopicsLoading(true);
    setTopicsError(null);
    setTopics([]); // Clear previous topics
    setSelectedTopic(null); // Reset selected topic
    setMessages([]); // Clear messages
    try {
      const fetchedTopics = await getKafkaTopics(env);
      setTopics(fetchedTopics);
      if (fetchedTopics.length === 0) {
        toast({
          title: "No Topics",
          description: `No topics found for the '${env}' environment.`,
        });
      }
    } catch (error) {
      console.error(`Failed to fetch topics for ${env}:`, error);
      setTopicsError(error instanceof Error ? error : new Error('Failed to fetch topics'));
      toast({
        title: "Error",
        description: `Could not fetch topics for '${env}'.`,
        variant: "destructive",
      });
    } finally {
      setIsTopicsLoading(false);
    }
  }, [toast]);

  const fetchMessages = useCallback(async (topic: string) => {
    if (!topic) return;
    setIsMessagesLoading(true);
    setMessagesError(null);
    setMessages([]); // Clear previous messages
    try {
      const fetchedMessages = await getKafkaMessages(topic, MESSAGE_COUNT);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error(`Failed to fetch messages for ${topic}:`, error);
      setMessagesError(error instanceof Error ? error : new Error('Failed to fetch messages'));
      toast({
        title: "Error",
        description: `Could not fetch messages for topic '${topic}'.`,
        variant: "destructive",
      });
    } finally {
      setIsMessagesLoading(false);
    }
  }, [toast]);

  // Initial fetch of connection status
  useEffect(() => {
    fetchConnectionStatus();
  }, [fetchConnectionStatus]);

  // Fetch topics when environment changes or initially
   useEffect(() => {
     fetchTopics(selectedEnv);
   }, [selectedEnv, fetchTopics]); // removed fetchTopics from dependency array as it causes infinite loop sometimes


  // Fetch messages when selected topic changes
  useEffect(() => {
    if (selectedTopic) {
      fetchMessages(selectedTopic);
    } else {
      setMessages([]); // Clear messages if no topic is selected
      setMessagesError(null);
    }
  }, [selectedTopic, fetchMessages]);

  const handleSelectTopic = (topicName: string) => {
    setSelectedTopic(topicName);
  };

  const handleRefreshAll = () => {
    toast({ title: "Refreshing...", description: "Fetching latest data." });
    fetchConnectionStatus();
    fetchTopics(selectedEnv);
    if (selectedTopic) {
      fetchMessages(selectedTopic);
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col">
      <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-primary">KafLook</h1>
         <Button onClick={handleRefreshAll} variant="outline" size="sm">
           <RefreshCw className="mr-2 h-4 w-4" /> Refresh All
         </Button>
      </header>

      <ConnectionStatus status={connectionStatus} isLoading={isConnectionLoading} error={connectionError} />

      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
         <Select value={selectedEnv} onValueChange={setSelectedEnv}>
           <SelectTrigger className="w-full sm:w-[200px] shadow">
             <SelectValue placeholder="Select Environment" />
           </SelectTrigger>
           <SelectContent>
             {environments.map((env) => {
                const Icon = env.icon;
                return (
                 <SelectItem key={env.value} value={env.value}>
                    <div className="flex items-center gap-2">
                        <Icon size={16} className="text-muted-foreground" />
                        <span>{env.label}</span>
                    </div>
                 </SelectItem>
               );
             })}
           </SelectContent>
         </Select>
          {/* Removed Fetch Topics button as topics fetch automatically on env change */}
      </div>


      <div className="flex flex-col md:flex-row gap-6 flex-grow">
        <TopicList
          topics={topics}
          selectedTopic={selectedTopic}
          onSelectTopic={handleSelectTopic}
          isLoading={isTopicsLoading}
          error={topicsError}
        />
        <MessageViewer
          messages={messages}
          selectedTopic={selectedTopic}
          isLoading={isMessagesLoading}
          error={messagesError}
        />
      </div>

       <footer className="mt-8 text-center text-muted-foreground text-sm">
         Built with Firebase Studio
       </footer>
    </div>
  );
}
