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

const ChordBox = ({ isInteractive }) => {
  const overlayStyle = isInteractive
    ? {}
    : {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: "rgba(255, 255, 255, 0.5)", // or any other color for the overlay
        zIndex: 2, // ensure it's above the content but below the modal/dialog if any
      };
  return (
    <div
      className={`relative flex flex-col gap-5 rounded-lg p-10 min-h-full min-w-full bg-white ${
        isInteractive ? "" : "cursor-not-allowed"
      }`}
      style={{ position: "relative" }} // make this element positioned relatively
    >
      {!isInteractive && <div style={overlayStyle} />}
      <div className="flex flex-row justify-between items-center">
        <h1 className="font-semibold">Chord Information</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={!isInteractive}>
            <div>
              <DownloadIcon className="h-5 w-5 text-gray-800/25 cursor-pointer" />
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
