"use client";
import NavBar from "../components/nav";
import Course from "@/components/course";
import Student from "@/components/student";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
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

  if (status === "loading") return <p>Loading session...</p>;
  if (status === "unauthenticated") {
    router.push("/login"); // Redirect to login if unauthenticated
    return <p>Redirecting to login...</p>;
  }

  if (!user) return <p>Loading user data...</p>;

  return (
    <>
      <NavBar />
      {user.isTeacher ? <Course/> :<Student />}
    </>
  );
}
