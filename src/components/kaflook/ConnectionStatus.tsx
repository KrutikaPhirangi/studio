"use client";

import type * as React from 'react';
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";
import type { KafkaConnectionStatus as ConnectionStatusType } from '@/services/kafka';

interface ConnectionStatusProps {
  status: ConnectionStatusType | null;
  isLoading: boolean;
  error: Error | null;
}

export function ConnectionStatus({ status, isLoading, error }: ConnectionStatusProps) {
  const isConnected = status?.isConnected ?? false;

  return (
    <div className="flex items-center gap-2 p-4 bg-card rounded-lg shadow-md mb-4">
      <span className="font-semibold text-card-foreground">Kafka Connection Status:</span>
      {isLoading ? (
        <Badge variant="secondary">Checking...</Badge>
      ) : error ? (
        <Badge variant="destructive" className="flex items-center gap-1">
          <WifiOff size={14} /> Error
        </Badge>
      ) : isConnected ? (
        <Badge variant="default" className="bg-accent text-accent-foreground flex items-center gap-1">
           <Wifi size={14} /> Connected
        </Badge>
      ) : (
        <Badge variant="destructive" className="flex items-center gap-1">
          <WifiOff size={14} /> Disconnected
        </Badge>
      )}
    </div>
  );
}
