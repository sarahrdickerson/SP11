"use client";

import * as React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuestionMarkCircledIcon, Cross2Icon } from "@radix-ui/react-icons";

const MoodSelector = ({ selected, setSelected, onRemove }) => {
  return (
    <div className="grid gap-2">
      <div className="flex flex-row gap-1 items-center justify-between">
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
        <Cross2Icon
          className="h-4 w-4 shrink-0 opacity-50 cursor-pointer"
          onClick={onRemove}
        />
      </div>

      <Textarea
        placeholder="Enter a mood or a mix of moods (eg. Happy, Energetic, Calm, Melancholic, etc.)"
        className="min-h-[80px] bg-[#efefef] border-none"
        onChange={(e) => setSelected(e.target.value)}
      />
    </div>
  );
};

export default MoodSelector;
