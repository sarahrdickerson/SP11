"use client";
import React from "react";
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
import { useAuth } from "@/context/authContext";
const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex flex-col gap-5 rounded-lg  p-10 h-screen">
        <h1 className="font-semibold">Please sign in to use the app</h1>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-3 p-5 gap-5 md:gap-0">
      <div className="col-span-1">
        <InputForm />
      </div>
      <div className="sm:col-span-1 md:col-span-2 md:pl-5">
        <div className="flex flex-col items-center min-h-full ">
          <OutputBox />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
