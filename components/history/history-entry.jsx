"use client";
import React from "react";
import AudioWave from "@/components/playback/audio-wave";
import { useEffect } from "react";

const HistoryEntry = ({ requestId }) => {
  const [request, setRequest] = React.useState(null);

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

    fetchRequest();
  }, [requestId]);

  if (!request) {
    return <div>No history to show</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-10 rounded-lg bg-white">
      <h3 className="text-lg">Prompt: {request.query}</h3>
      <h2 className="text-md">Model: {request.model}</h2>
      <AudioWave
        isInteractive={true}
        url={`/api/download/${request.wav_file_id}`}
      />
    </div>
  );
};

export default HistoryEntry;
