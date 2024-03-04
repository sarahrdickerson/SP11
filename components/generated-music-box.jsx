"use client";
import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileIdContext } from "@/context/fileIdContext";

const GeneratedMusicBox = () => {
  const { currentFileId } = React.useContext(FileIdContext);

  const handleMp3Download = async () => {
    console.log("Download MP3");
    console.log(currentFileId);

    try {
      const res = await fetch("/api/download/${currentFileId}");
      if (res.status === 200) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "generated_music.mp3";
        a.click();
      } else {
        console.log("Download failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

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
            {/* <DropdownMenuItem>Download MIDI</DropdownMenuItem> */}
            <DropdownMenuItem onClick={handleMp3Download}>
              Download MP3
            </DropdownMenuItem>
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
