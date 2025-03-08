"use client"
import Image from "next/image";
import NavBar from "../components/nav";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FileUpload from "../components/fileUpload"
import TeacherMaterials from "../components/TeacherMaterial"
export default function Home() {
  // const router=useRouter();
  // const { data: session, status } = useSession();
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [activities, setActivities] = useState([]);

  // useEffect(() => {
  //   if (status === "authenticated") {
  //     getUserData();
  //   }
  // }, [status]);
  // const getUserData = () => {
  //   fetch(`/api/userInfo`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${session?.accessTokenBackend}`,
  //       "Access-Control-Allow-Origin": "*",
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {

  //     });
  // };

  return (
    <>
      <NavBar />
      <FileUpload></FileUpload>
      <TeacherMaterials></TeacherMaterials>
    </>
  )
}
