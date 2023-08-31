"use client";
import { db } from "@/firebase-config";
import { User } from "firebase/auth";
import firebase from "firebase/app";
import "firebase/firestore";
import {
  DocumentData,
  QuerySnapshot,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { unsubscribe } from "diagnostics_channel";

type ChatProps = {
  user: User | null | undefined;
  select: any;
};
type ChatState = {
  email: string;
  name: string;
  profileImage: string;
  lastUpdated: string;
}[];

export const Chats = ({ user, select }: ChatProps) => {
  const [chats, setChats] = useState<ChatState>([]);
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState<string>("");
  useEffect(() => {
    if (user && user.email) {
      const currentUserRef = doc(db, "users", user.email);
      const chatsCollectionRef = collection(currentUserRef, "chats");
      const chatsQuery = query(
        chatsCollectionRef,
        orderBy("lastUpdated", "desc")
      );

      getDocs(chatsQuery)
        .then((querySnapshot) => {
          const chatData: any[] = [];
          querySnapshot.forEach((doc) => {
            chatData.push(doc.data());
          });
          setChats(chatData);
          console.log(chatData);
        })
        .catch((error) => {
          console.error("Error fetching chat data:", error);
        });
    }
  }, [user, db]);

  useEffect(() => {
    if (user && user.email) {
      const docRef = doc(collection(db, "/users/"));
      const messagesCollectionRef = collection(
        db,
        "/users/",
        user.email,
        "chats"
      );

      const messagesQuery = query(
        messagesCollectionRef,
        orderBy("lastUpdated", "desc")
      );

      onSnapshot(messagesQuery, (querySnapshot) => {
        const chatData: any[] = [];
        querySnapshot.forEach((doc) => {
          chatData.push(doc.data());
        });
        setChats(chatData);
      });
    }
  }, [user]);

  return (
    <div>
      {chats.map((chat) => (
        <div
          key={chat.email}
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
