"use client";
import { db } from "@/firebase-config";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type ChatsSearchProps = {
  filter: number;
  select: any;
};

export type SearchedUsersProps = {
  name: string;
  profileImage: string;
  email: string;
  chats: [];
};

export default function ChatsSearch({ filter, select }: ChatsSearchProps) {
  const [searchedText, setSearchedText] = useState<string>("");
  const [searchedUsers, setSearchedUsers] = useState<SearchedUsersProps[]>([]);
  useEffect(() => {
    setSearchedUsers([]);
    if (searchedText) {
      const timer = setTimeout(() => {
        getDocs(collection(db, "users")).then((querySnapshot) => {
          const newData = querySnapshot.docs;
          if (filter == 0) {
            const nameUsers = newData.filter((doc) =>
              doc.data().name.toLowerCase().includes(searchedText)
            );
            nameUsers.map((doc) =>
              setSearchedUsers((prev: any) => [
                ...prev,
                { ...doc.data(), email: doc.id },
              ])
            );
          } else {
            const emailUsers = newData.filter((doc) =>
              doc.id.split("@")[0].includes(searchedText)
            );
            emailUsers.map((doc) =>
              setSearchedUsers((prev: any) => [
                ...prev,
                { ...doc.data(), email: doc.id },
              ])
            );
          }
        });
      }, 500);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [searchedText]);

  const searchValueHandler = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchedText(e.target.value);
  };

  return (
    <div className="flex items-center justify-between dark:bg-white/5 bg-black/5 px-4 py-1 rounded relative z-50">
      <div className="pr-4 h-full w-full">
        <input
          className="w-full h-full text-sm outline-none text-black dark:text-white bg-transparent "
          value={searchedText}
          onChange={searchValueHandler}
          placeholder="Search chat"
        />
      </div>
      <div className="">
        <FontAwesomeIcon
          icon={faSearch}
          className="w-4 h-4 text-black/10 dark:text-white/20"
        />
      </div>
      {searchedUsers.length > 0 && (
        <div className="absolute w-full flex flex-col max-h-[208px] overflow-y-scroll scroll-smooth dark:bg-neutral-800 bg-neutral-100 top-10 left-0 z-50 shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] dark:shadow-[0px_0px_15px_0px_rgba(255,255,255,0.1)] rounded-lg p-2 select-none">
          {searchedUsers.map((user, index) => (
            <div
              key={index}
              className="flex items-center gap-x-2 p-2 cursor-pointer dark:hover:bg-neutral-900 hover:bg-neutral-200 transition-all duration-300 rounded"
              onClick={() => {
                select(user);
                setSearchedUsers([]);
                setSearchedText("");
              }}
            >
              <div className="w-8 h-8 aspect-square rounded-full relative">
                {user?.profileImage && (
                  <Image
                    src={user?.profileImage}
                    alt=" "
                    height={100}
                    width={100}
                    className="absolute w-full h-full object-cover object-center rounded-full"
                  />
                )}
              </div>
              <div className="dark:text-white text-black text-sm">
                {user.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
