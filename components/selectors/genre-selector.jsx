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

const GenreSelector = ({ selected, setSelected, onRemove }) => {
  return (
    <div className="grid gap-2">
      <div className="flex flex-row gap-1 items-center justify-between">
        <div className="flex flex-row gap-1 items-center ">
          <Label htmlFor="model">Genre</Label>
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
              Choose the genre of the music. The genre selection will guide the
              AI to produce music in styles like Pop, Rock, Classical, Jazz, and
              more, aligning with your creative vision.
            </HoverCardContent>
          </HoverCard>
        </div>
        <Cross2Icon
          className="h-4 w-4 shrink-0 opacity-50 cursor-pointer"
          onClick={onRemove}
        />
      </div>

      <Textarea
        placeholder="Enter a genre or a mix of genres (eg. Pop, Rock, Classical, Jazz, etc.)"
        className="min-h-[90px] bg-[#efefef] border-none"
        onChange={(e) => setSelected(e.target.value)}
      />
    </div>
  );
};

export default GenreSelector;
