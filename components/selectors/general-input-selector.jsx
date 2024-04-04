"use client";

import * as React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

const GeneralInputSelector = ({ selectedInput, setSelectedInput }) => {
  return (
    <div className="grid gap-2">
      <div className="flex flex-row gap-1 items-center">
        <Label htmlFor="model">Prompt</Label>
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <div>
              <QuestionMarkCircledIcon className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </HoverCardTrigger>
          <HoverCardContent
            align="start"
            className="w-[260px] text-sm"
            side="left"
          >
            Describe the music you want to generate in a few sentences.
          </HoverCardContent>
        </HoverCard>
      </div>

      <Textarea
        placeholder="A grand orchestral arrangement with thunderous percussion, epic brass fanfares, and soaring strings, creating a cinematic atmosphere fit for a heroic battle"
        className="min-h-[150px] bg-[#efefef] border-none"
        onChange={(e) => setSelectedInput(e.target.value)}
      />
    </div>
  );
};

export default GeneralInputSelector;
