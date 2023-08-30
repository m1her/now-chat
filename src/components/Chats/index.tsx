"use client";
import { db } from "@/firebase-config";
import { User } from "firebase/auth";
import firebase from 'firebase/app';
import 'firebase/firestore';
import { collection, doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type ChatProps = {
  user: User | null | undefined;
  select: any;
};
type ChatState = { email: string; name: string; profileImage: string }[];

export const Chats = ({ user, select }: ChatProps) => {
  const [chats, setChats] = useState<ChatState>([]);
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState<string>("");
  useEffect(() => {
    if (user && user.email) {
      getDoc(doc(db, "users", user.email)).then((doc) => {
        setChats(doc?.data()?.chats);
        console.log(doc?.data()?.chats);
      });
    }
  }, [user]);

  useEffect(() => {
    const usersCollection = collection(db, "users");
    const unsubscribe = firebase.firestore().collection(db, 'users')
      .onSnapshot((snapshot) => {
        const updatedData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(updatedData);
      });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {chats.map((chat) => (
        <div key={chat.email}
          className={`flex gap-x-2 items-center hover:bg-white/5 cursor-pointer p-1 rounded select-none
          ${selected == chat.name ? "bg-white/5" : ""}`}
          onClick={() => {
            select(chat);
            setSelected(chat.name);
          }}
        >
          <div className="w-10 h-10 rounded-full relative">
            <Image
              src={chat.profileImage}
              alt=" "
              height={100}
              width={100}
              className="absolute w-full h-full object-cover object-center rounded-full"
            />
          </div>
          <div className="dark:text-white text-black font-medium">
            {chat.name}
          </div>
        </div>
      ))}
    </div>
  );
};

