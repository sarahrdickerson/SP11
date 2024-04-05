"use client";
import { LoginMenu } from "@/components/auth/loginmenu";
import SignInForm from "@/components/signin-form";
import React from "react";

const SignInPage = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <LoginMenu />
    </div>
  );
};

export default SignInPage;
