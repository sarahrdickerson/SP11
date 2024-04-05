"use client";
import React from "react";
import HistoryEntry from "./history-entry";
import { useEffect } from "react";

const HistoryForm = ({ userId }) => {
  const [history, setHistory] = React.useState([]);
  const [reqHistory, setReqHistory] = React.useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/user_wav_history/${userId}`);
        const data = await response.json();
        if (data.success) {
          setHistory(data.wav_files);
          setReqHistory(data.requests);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    if (userId) {
      fetchHistory();
    }
  }, [userId]);
  return (
    <div className="flex flex-col gap-5 p-10 ">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl">Music Files History</h2>
      </div>
      <div className="flex flex-col gap-10">
        {reqHistory.length > 0 ? (
          reqHistory.map((request) => (
            // Pass the entire request object now, not just the ID
            <HistoryEntry key={request} requestId={request} />
          ))
        ) : (
          <p>No history to show.</p>
        )}
      </div>
      {/* {history.length > 0 ? (
        history.map((wav_file_id) => (
          <HistoryEntry key={wav_file_id} wav_file_id={wav_file_id} />
        ))
      ) : (
        <p>No history to show.</p>
      )} */}
    </div>
  );
};

export default HistoryForm;
