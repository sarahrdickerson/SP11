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
        <Label htmlFor="model">General Input</Label>
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
            Instead of specifying the model, genre, and mood, you can provide a
            general input to the model. This can be a list of instruments, a
            chord progression, or a melody. The model will use this input to
            generate a piece of music.
          </HoverCardContent>
        </HoverCard>
      </div>

      <Textarea
        placeholder="Enter a general description (eg. list of instruments, chord progression, melody, etc.)"
        className="min-h-[80px]"
        onChange={(e) => setSelectedInput(e.target.value)}
      />
    </div>
  );
};

export default GeneralInputSelector;
