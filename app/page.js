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
    // <AuthProvider>
    <FileIdContext.Provider value={{ currentFileId, setCurrentFileId }}>
      <div className=" h-full flex-col md:flex bg-[#efefef]">
        <Navbar />
        {/* <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <h2 className="text-lg font-semibold">SP11 Music Generator App</h2>
          <Link href="/signin">
            <Button variant="outline">Sign In</Button>
          </Link>
        </div> */}

        <Dashboard />
        {/* <div className="grid sm:grid-cols-1 md:grid-cols-3 p-5 gap-5 md:gap-0">
            <div className="col-span-1">
              <InputForm />
            </div>
            <div className="sm:col-span-1 md:col-span-2 md:pl-5">
              <div className="flex flex-col items-center min-h-full ">
                <OutputBox />
              </div>
            </div>
          </div> */}
      </div>
    </FileIdContext.Provider>
    // </AuthProvider>
  );
}
