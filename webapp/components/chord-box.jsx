import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { DownloadIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ChordBox = () => {
  return (
    <div className="flex flex-col gap-5 rounded-lg border-slate-400/25 p-10 border min-h-full min-w-full">
      <div className="flex flex-row justify-between items-center">
        <h1 className="font-semibold">Chord Information</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              <DownloadIcon className="h-5 w-5 text-gray-800/25" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={5} align="end">
            <DropdownMenuItem>Download PNG</DropdownMenuItem>
            <DropdownMenuItem>Download JPEG</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-col items-center">
        <Image src="/chords.png" width={300} height={500} />
      </div>
    </div>
  );
};

export default ChordBox;
