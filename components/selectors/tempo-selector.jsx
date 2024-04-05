"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { QuestionMarkCircledIcon, Cross2Icon } from "@radix-ui/react-icons";

const TempoSelector = ({ selected, setSelected, onRemove }) => {
  // Use local state to manage the displayed tempo value
  const [displayedTempo, setDisplayedTempo] = useState(selected);

  // Update local state whenever selectedTempo prop changes
  useEffect(() => {
    setDisplayedTempo(selected);
  }, [selected]);

  const handleTempoChange = (valueArray) => {
    const value = Array.isArray(valueArray) ? valueArray[0] : valueArray;
    setSelected(value);
    // Also update the displayed tempo immediately
    setDisplayedTempo(value);
  };
  return (
    <div className="grid gap-2">
      <div className="flex flex-row justify-between items-center pb-1">
        <div className="flex flex-row gap-1 items-center">
          <Label htmlFor="model">Tempo</Label>
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
              Adjust the tempo, the speed or pace of the generated piece,
              measured in beats per minute (BPM). This can range from slow and
              relaxed to fast and energetic, influencing the overall feel of the
              music.
            </HoverCardContent>
          </HoverCard>
        </div>

        <div className="flex flex-row gap-2 items-center">
          <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
            {displayedTempo}
          </span>
          <Cross2Icon
            className="h-4 w-4 shrink-0 opacity-50 cursor-pointer"
            onClick={onRemove}
          />
        </div>
      </div>
      <Slider
        id="tempo"
        max={208}
        min={40}
        defaultValue={[108]}
        step={1}
        onValueChange={handleTempoChange}
        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
        aria-label="Tempo"
      />
    </div>
  );
};

export default TempoSelector;
