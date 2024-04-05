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
  const [isGenerated, setIsGenerated] = React.useState(false);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-4 pt-60">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">
            Welcome to SP11 Music Generator
          </h1>
          <p className="mb-6">
            Sign in to create and manage your generated music tracks.
          </p>

          <Link href="/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-3 p-5 gap-5 md:gap-0">
      <div className="col-span-1">
        <InputForm onGenerate={() => setIsGenerated(true)} />
      </div>
      <div className="sm:col-span-1 md:col-span-2 md:pl-5">
        <div className="flex flex-col items-center min-h-full ">
          <OutputBox isGenerated={isGenerated} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
