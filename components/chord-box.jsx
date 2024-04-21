import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { DownloadIcon } from "@radix-ui/react-icons";
import { FileIdContext } from "@/context/fileIdContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axiosInstance from "@/api/axiosConfig";

const ChordBox = ({ isInteractive }) => {
  const { currentChordId } = React.useContext(FileIdContext);
  const [chordText, setChordText] = React.useState(""); // New state variable for storing chord text

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

  React.useEffect(() => {
    console.log("Current Chord ID updated:", currentChordId);
    if (currentChordId) {
      axiosInstance
        .get(`/api/download_chord/${currentChordId}`)
        .then((response) => {
          // Assuming the response is the text data directly
          setChordText(response.data); // Set the chord text data
        })
        .catch((error) => {
          console.error("Error fetching chord data:", error);
        });
    }
  }, [currentChordId]);

  const handleDownloadChords = () => {
    console.log("Download chords with ID: ", currentChordId);
    axiosInstance
      .get(`/api/download_chord/${currentChordId}`)
      .then((response) => {
        console.log(response);
        const file = new Blob([response.data], { type: "text/plain" });
        const url = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = `chords.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.log(error);
      });
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
            <DropdownMenuItem onClick={() => handleDownloadChords()}>
              Download txt file
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-full items-center max-h-[200px] overflow-y-auto flex flex-col">
        {/* Conditionally display the chord text if available */}
        {chordText ? (
          <div className="text-box">
            <pre>{chordText}</pre> {/* Use pre for preformatted text */}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* You might want to display a placeholder or a loading spinner here */}
            <p>Loading chords...</p>
          </div>
        )}
        {/* <Image src="/chords.png" width={300} height={500} /> */}
      </div>
    </div>
  );
};

export default ChordBox;
