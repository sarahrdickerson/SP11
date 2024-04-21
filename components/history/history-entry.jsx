"use client";
import React from "react";
import AudioWave from "@/components/playback/audio-wave";
import { useEffect } from "react";

const HistoryEntry = ({ requestId }) => {
  const [request, setRequest] = React.useState("");
  const [chordText, setChordText] = React.useState("");

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        console.log("Request ID:", requestId);
        const response = await fetch(`/api/get_request/${requestId}`);
        const data = await response.json();
        if (data.success) {
          setRequest(data.request);
        } else {
          console.error("Request not found");
        }
      } catch (error) {
        console.error("Error fetching request:", error);
      }
    };

    const fetchChordData = async () => {
      if (request?.chord_file_id) {
        try {
          const response = await fetch(
            `/api/download_chord/${request.chord_file_id}`
          );
          const text = await response.text(); // Get text from the response
          setChordText(text); // Set the chord text data
        } catch (error) {
          console.error("Error fetching chord data:", error);
        }
      }
    };

    fetchRequest();
    fetchChordData();
  }, [requestId, request?.chord_file_id]);

  if (!request) {
    return <div>No history to show</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-10 rounded-lg bg-white">
      <h3 className="text-lg">Prompt: {request.query}</h3>
      <h2 className="text-md">Model: {request.model}</h2>
      <AudioWave
        isInteractive={true}
        url={`/api/download/wav/${request.wav_file_id}`}
      />
      {/*  chord information */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg">Chords:</h3>
        <pre className="p-4 bg-gray-100 rounded-lg max-h-[200px] overflow-scroll">
          {chordText || "Loading chords..."}
        </pre>
      </div>
    </div>
  );
};

export default HistoryEntry;
