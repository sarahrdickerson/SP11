"use client";

import * as React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

const LengthSelector = ({ selectedLength, setSelectedLength }) => {
  return (
    <div className="grid gap-2">
      <div className="flex flex-row gap-1 items-center">
        <Label htmlFor="model">Sample Length</Label>
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
            Input the desired length of the sample in seconds.
          </HoverCardContent>
        </HoverCard>
      </div>

      <Input
        placeholder="Length (s)"
        onChange={(e) => setSelectedLength(e.target.value)}
        className="bg-[#efefef] border-none"
      />
    </div>
  );
};

export default LengthSelector;
