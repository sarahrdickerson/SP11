"use client";
import Image from "next/image";
import React from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import InputForm from "@/components/input-form";
import OutputBox from "@/components/output-box";
import Link from "next/link";
import { FileIdContext } from "@/context/fileIdContext";
import { AuthProvider } from "@/context/authContext";
import Dashboard from "./dashboard/page";
import Navbar from "@/components/nav/navbar";
export default function Home() {
  const [currentFileId, setCurrentFileId] = useState(null);

  return (
    <FileIdContext.Provider value={{ currentFileId, setCurrentFileId }}>
      <div className="flex-col md:flex ">
        <Dashboard />
      </div>
    </FileIdContext.Provider>
  );
}
