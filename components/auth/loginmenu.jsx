"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/api/axiosConfig";

import { useAuth } from "@/context/authContext";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export function LoginMenu() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [error, setError] = useState("");

  const loginUser = async () => {
    setError("");
    const result = await login(email, password);
    if (result.success) {
      router.push("/");
    } else {
      setError(result.message);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {error && (
          <div className="flex flex-row bg-red-500">
            <div className="text-white flex flex-row gap-2 items-center p-2">
              {" "}
              <ExclamationTriangleIcon />
              {error}
            </div>
          </div>
        )}{" "}
        {/* Display error message if any */}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center space-y-2">
        <Button className="w-full" onClick={loginUser}>
          Login
        </Button>
        {/* <Link href="/forgot-password" className="text-sm text-blue-600">
          Forgot your password?
        </Link> */}
        <div className="flex flex-row items-center justify-center space-x-1">
          <p className="text-sm">Don't have an account?</p>
          <Link href="/register" className="text-sm text-blue-600">
            Sign Up Here
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
