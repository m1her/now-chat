"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { auth } from "@/firebase-config";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";
import Image from "next/image";
type NavBarProps = {
  setToggleSideBar: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null | undefined;
};
export const NavBar = ({ setToggleSideBar, user }: NavBarProps) => {
  const router = useRouter();
  const signOut = () => {
    auth.signOut();
    router.push("/");
  };
  return (
    <div className="fixed top-0 left-0 w-full flex items-center justify-between px-8 py-4 select-none">
      <div className="flex gap-x-2 items-center">
        <FontAwesomeIcon
          icon={faBars}
          className="dark:text-third-color text-secondary-dark w-7 h-7 cursor-pointer md:hidden"
          onClick={() => setToggleSideBar((prev) => !prev)}
        />
        <div className="whitespace-nowrap dark:text-third-color text-secondary-dark text-xl font-bold">
          Now Chat
        </div>
      </div>
      <div className="flex gap-x-2">
        <div className="flex text-xs gap-x-2 items-center py-2.5 px-4 border-b dark:border-white/10 border-black/5">
          <div className="dark:text-white/90 text-black/90 font-semibold">
            {user?.displayName}
          </div>
          <div className="w-7 h-7 aspect-square rounded-full relative">
            <Image
              src={user?.photoURL || ""}
              alt=" "
              height={100}
              width={100}
              className="absolute w-full h-full object-cover object-center rounded-full"
            />
          </div>
        </div>
        <div
          className="dark:text-third-color text-secondary-dark font-semibold flex flex-shrink-0 items-center gap-x-2
        cursor-pointer hover:dark:bg-[#fca311]/20 hover:bg-[#14213d]/20 rounded px-2 py-1 transition-all duration-300
        "
        >
          <div className="whitespace-nowrap" onClick={signOut}>
            Sign out
          </div>
          <FontAwesomeIcon icon={faSignOut} className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
