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

const InstrumentsSelector = ({
  selectedInstruments,
  setSelectedInstruments,
}) => {
  return (
    <div className="grid gap-2">
      <div className="flex flex-row gap-1 items-center">
        <Label htmlFor="model">Instruments</Label>
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
            Specify particular instruments to feature in your composition, such
            as Piano, Guitar, Violin, or Drums. This option lets you shape the
            musical arrangement to your preference.
          </HoverCardContent>
        </HoverCard>
      </div>

      <Textarea
        placeholder="Enter a list of instruments (eg. Piano, Guitar, Violin, Drums, etc.)"
        className="min-h-[80px]"
        onChange={(e) => setSelectedInstruments(e.target.value)}
      />
    </div>
  );
};

export default InstrumentsSelector;
