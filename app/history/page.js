"use client";
import HistoryForm from "@/components/history/history-form";
import React from "react";
import { useAuth } from "@/context/authContext";

const HistoryPage = () => {
  const [userId, setUserId] = React.useState(null);

  React.useEffect(() => {
    // Ensure we're running this in the browser
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          // Assuming that the user object was stored as JSON
          const user = JSON.parse(storedUser);
          setUserId(user.id); // or however you have stored the email field
          console.log("User ID:", user.id);
        } catch (error) {
          console.error("Failed to parse the user from localStorage:", error);
        }
      }
    }
  }, []);

  return (
    <div className="pl-20 pr-20 pt-5">
      <HistoryForm userId={userId} />
    </div>
  );
};

export default HistoryPage;
