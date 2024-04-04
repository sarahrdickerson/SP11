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
const RegisterMenu = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function registerUser() {
    console.log("Registering user");
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const data = {
      email: email,
      password: password,
    };
    console.log("request data: ", data);
    axiosInstance
      .post("/api/auth/register", data)
      .then((res) => {
        console.log("response: ", res);
        if (res.data["success"] === true) {
          console.log("User created");
          router.push("/signin");
        } else {
          alert(res.data["message"]);
        }
      })
      .catch((err) => {
        console.error("error: ", err);
      });
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>
          Fill out the following information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
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
        {/* confirm password */}
        <div className="grid gap-2">
          <Label htmlFor="password">Confirm Password</Label>
          <Input
            id="password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center space-y-2">
        <Button className="w-full" onClick={registerUser}>
          Register
        </Button>
        <div className="flex flex-row items-center justify-center space-x-1">
          <p className="text-sm">Already have an account?</p>
          <Link href="/signin" className="text-sm text-blue-600">
            Login Here
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RegisterMenu;
