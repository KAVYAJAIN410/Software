"use client";
import FileUpload from "../../components/fileUpload";
import TeacherMaterials from "../../components/TeacherMaterial";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Courses() {
  const [user, setUser] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

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
    router.push("/login");
    return <p>Redirecting to login...</p>;
  }

  if (!user) return <p>Loading user data...</p>;

  return (
    <>
      {user?.isTeacher && <FileUpload />}
      <TeacherMaterials />
    </>
  );
}
