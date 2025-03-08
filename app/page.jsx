"use client";
import NavBar from "../components/nav";
import Course from "@/components/course";
import Student from "@/components/student";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Home from "../components/home"
export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.accessTokenBackend) {
      getUserData();
    }
  }, [status, session]);

  const getUserData = async () => {
    try {
      const res = await fetch("/api/userInfo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessTokenBackend}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
      } else {
        console.error("Error fetching user:", data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  
  

  return (
    <>
  <NavBar />

  {user ? (
    user.isTeacher ? <Course /> : <Student />
  ) : (
    <Home></Home> // This can be replaced with a proper fallback UI
  )}
</>

  );
}
