"use client";

import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Wifi } from "lucide-react";

export function ConnectionStatus() {
  return (
    <div className="flex items-center gap-2 p-4 bg-card rounded-lg shadow-md mb-4">
      <span className="font-semibold text-card-foreground">Kafka Connection Status:</span>
        <Badge variant="default" className="bg-accent text-accent-foreground flex items-center gap-1">
           <Wifi size={14} /> Connected
        </Badge>
    </div>
  );
}
