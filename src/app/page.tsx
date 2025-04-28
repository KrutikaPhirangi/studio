"use client";

import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ConnectionStatus } from '@/components/kaflook/ConnectionStatus';
import { TopicList } from '@/components/kaflook/TopicList';
import { MessageViewer } from '@/components/kaflook/MessageViewer';
import {
  getKafkaTopics,
  getKafkaMessages,
  type KafkaTopic,
  type KafkaMessage, 
  connectToKafka
} from '@/services/kafka';
import { TestTubeDiagonal, Workflow } from 'lucide-react';

const environments = [
  { value: 'dev', label: 'Development', icon: Workflow },
  { value: 'empty_env_example', label: 'empty_env_example', icon: Workflow },
  { value: 'sandbox', label: 'Sandbox', icon: TestTubeDiagonal },
];

  const [selectedEnv, setSelectedEnv] = useState<string>(environments[0].value);
  const [topics, setTopics] = useState<KafkaTopic[]>([]);
  const [isTopicsLoading, setIsTopicsLoading] = useState(false);
  const [topicsError, setTopicsError] = useState<Error | null>(null);

  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [messages, setMessages] = useState<KafkaMessage[]>([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<Error | null>(null);

  const { toast } = useToast();
const MESSAGE_COUNT = 10; // Number of messages to fetch
export default function KafLookPage() {
  const brokers = ['localhost:9092'];
  const fetchTopics = useCallback(async (env: string) => {
    setIsTopicsLoading(true);
    setTopicsError(null);
    setTopics([]);
    setSelectedTopic(null);
    setMessages([]);
    try {
      const fetchedTopics = await getKafkaTopics(env);
      setTopics(fetchedTopics);

      if (fetchedTopics.length === 0) {
        toast({
          title: "No Topics",
          description: `No topics found for the '${env}' environment.`,        
        variant: "destructive",
      });
    } finally {
      setIsTopicsLoading(false);
    }
  }, [toast,setTopics]);

const fetchMessages = useCallback(async (topic: string) => {
    if (!topic) return;
    setIsMessagesLoading(true);
    setMessagesError(null);
    setMessages([]);
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

  // Initial fetch
  useEffect(() => {
        async function fetchData() {
            try{
                await connectToKafka(brokers);
                await fetchTopics(selectedEnv)
            }catch(e){
                toast({title:"Error",description:e instanceof Error ? e.message : "Could not connect to Kafka broker.",variant: "destructive"})
            }
        }
        fetchData()
  }, []);

   useEffect(() => {fetchTopics(selectedEnv);}, [selectedEnv]);
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
  
  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col">
      <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-primary">KafLook</h1>
      </header>
       {/* Connection Status */}
      <ConnectionStatus  />

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
