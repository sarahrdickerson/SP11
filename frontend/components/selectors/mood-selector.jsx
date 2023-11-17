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

const MoodSelector = ({ selectedMood, setSelectedMood }) => {
  return (
    <div className="grid gap-2">
      <div className="flex flex-row gap-1 items-center">
        <Label htmlFor="model">Mood</Label>
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
            Select the mood to set the emotional tone of your music, ranging
            from Happy and Energetic to Calm and Melancholic, tailoring the
            output to fit the desired emotional context.
          </HoverCardContent>
        </HoverCard>
      </div>

      <Textarea
        placeholder="Enter a mood or a mix of moods (eg. Happy, Energetic, Calm, Melancholic, etc.)"
        className="min-h-[80px]"
        onChange={(e) => setSelectedMood(e.target.value)}
      />
    </div>
  );
};

export default MoodSelector;
