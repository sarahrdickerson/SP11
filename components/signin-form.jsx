"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    console.log("Sign In");
  };

  return (
    <div>
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Button variant="outline" onClick={handleSignIn}>
        Sign In
      </Button>
    </div>
  );
};

export default SignInForm;
