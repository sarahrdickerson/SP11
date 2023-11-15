"use client";

import * as React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

const TempoSelector = ({ selectedTempo, setSelectedTempo }) => {
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

        <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
          {selectedTempo}
        </span>
      </div>
      <Slider
        id="tempo"
        max={208}
        min={40}
        defaultValue={[108]}
        step={1}
        onValueChange={setSelectedTempo}
        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
        aria-label="Tempo"
      />
    </div>
  );
};

export default TempoSelector;
