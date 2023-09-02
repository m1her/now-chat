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
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { unsubscribe } from "diagnostics_channel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";

type ChatProps = {
  user: User | null | undefined;
  select: any;
};
type ChatState = {
  email: string;
  name: string;
  profileImage: string;
  lastUpdated: string;
  seen: boolean;
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

  const seeChat = (chatId: string | undefined) => {
    if (user && user.email) {
      const chatRef = doc(
        collection(db, "/users/", user?.email, "chats"),
        chatId
      );
      updateDoc(chatRef, { seen: true });
    }
  };

  return (
    <div className="h-full flex flex-col gap-y-2 overflow-y-scroll">
      {chats.map((chat) => (
        <div
          key={chat.email}
          className={`whitespace-nowrap flex justify-between items-center dark:hover:bg-white/5 hover:bg-black/5 transition-all duration-300 cursor-pointer p-1 rounded select-none
          ${selected == chat.name ? "bg-white/5" : ""}`}
          onClick={() => {
            select(chat);
            setSelected(chat.name);
            seeChat(chat.email);
          }}
        >
          <div className="flex items-center gap-x-2">
            <div className="w-10 h-10 rounded-full relative flex-shrink-0">
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
          {!chat.seen && (
            <div className="w-4 h-4 bg-third-color rounded-full flex items-center justify-center">
              <FontAwesomeIcon
                icon={faExclamation}
                className=" w-3 h-3 text-black"
              />
            </div>
          )}
        </div>
      ))}
    </div> 
  );
};
