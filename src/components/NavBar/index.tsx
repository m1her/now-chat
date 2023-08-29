"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { auth } from "@/firebase-config";
import { useRouter } from "next/navigation";

export const NavBar = () => {
  const router = useRouter();
  const signOut = () => {
    auth.signOut();
    router.push("/");
  };
  return (
    <div className="fixed top-0 left-0 w-full flex justify-between px-8 py-4 ">
      <div className="dark:text-third-color text-secondary-dark text-xl font-bold">
        Now Chat
      </div>
      <div className="dark:text-third-color text-secondary-dark font-semibold flex flex-shrink-0 items-center gap-x-2">
        <div className="whitespace-nowrap" onClick={signOut}>
          Sign out
        </div>
        <FontAwesomeIcon icon={faSignOut} className="w-4 h-4" />
      </div>
    </div>
  );
};
