"use client";
import * as React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { DownloadIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const GeneratedMusicBox = () => {
  return (
    <div className="flex flex-col gap-5 rounded-lg border-slate-400/25 p-10 border min-h-full min-w-full">
      <div className="flex flex-row justify-between items-center">
        <h1 className="font-semibold">Generated Music</h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              <DownloadIcon className="h-5 w-5 text-gray-800/25" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={5} align="end">
            <DropdownMenuItem>Download MIDI</DropdownMenuItem>
            <DropdownMenuItem>Download MP3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-col items-center">
        <Image src="/soundwave.png" width={600} height={500} />
        <div className="flex flex-row gap-5 items-center">
          <Button>Play</Button>
        </div>
      </div>
    </div>
  );
};

export default GeneratedMusicBox;
