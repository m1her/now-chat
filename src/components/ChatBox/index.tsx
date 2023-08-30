"use client";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { SearchedUsersProps } from "../ChatsSearch";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "@/firebase-config";
import { User } from "firebase/auth";

type ChatBoxProps = {
  userChat: SearchedUsersProps;
  chatId: string;
  user: User | null | undefined;
};

export const ChatBox = ({ userChat, chatId, user }: ChatBoxProps) => {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<
    {
      id: string;
      message: string;
      sender: string | null;
      time: string;
    }[]
  >([]);

  const messageTextHandler = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setMessageText(e.target.value);
  };

  const sendHandler = () => {
    if (user) {
      const docRef = doc(collection(db, "/chats/"), chatId);
      const messagesCollectionRef = collection(docRef, "messages");
      addDoc(messagesCollectionRef, {
        message: messageText,
        sender: user.displayName,
        time: new Date().toString(),
      });
      setMessages((prev) => [
        {
          id: Math.random().toString(),
          message: messageText,
          sender: user.displayName,
          time: new Date().toString(),
        },
        ...prev,
      ]);
      setMessageText("");
    }
  };
  const EnterSendHandler = (e: { key: string }) => {
    if (e.key == "Enter") {
      sendHandler();
    }
  };

  useEffect(() => {
    setMessages([]);
    if (user && chatId) {
      const docRef = doc(collection(db, "/chats/"), chatId);
      const messagesCollectionRef = collection(docRef, "messages");

      // Query the 'messages' subcollection to get the latest 10 documents
      const messagesQuery = query(
        messagesCollectionRef,
        orderBy("time", "desc"),
        limit(10)
      );

      // Initialize an array to store the messages
      const latestMessages: React.SetStateAction<
        {
          id: string;
          message: string;
          sender: string;
          time: string;
        }[]
      > = [];

      getDocs(messagesQuery)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            latestMessages.push({
              id: doc.id,
              message: doc.data().message,
              sender: doc.data().sender,
              time: doc.data().time,
            });
          });

          // Set the 'latestMessages' array to the state using setMessages([])
          setMessages(latestMessages);
        })
        .catch((error) => {
          console.error("Error getting documents:", error);
        });
    }
  }, [chatId]);

  return (
    <div className="col-span-2 flex flex-col justify-between h-full dark:bg-white/5 bg-white rounded-lg">
      <div className="flex items-center py-2.5 px-4 border-b dark:border-white/10 border-black/5">
        <div className="w-10 h-10 aspect-square rounded-full relative">
          {userChat?.profileImage && (
            <Image
              src={userChat?.profileImage}
              alt=" "
              height={100}
              width={100}
              className="absolute w-full h-full object-cover object-center rounded-full"
            />
          )}
        </div>
        <div className="ml-4 dark:text-white/90 text-black/90 font-semibold">
          {userChat?.name}
        </div>
      </div>
      <div className="w-full overflow-y-scroll h-[65vh] flex flex-col-reverse gap-y-2 p-2">
        {messages &&
          messages.map((message) => (
            <div
              key={message.id}
              className="flex gap-x-2 items-Start"
              dir={message.sender === user?.displayName ? "rtl" : "ltr"}
            >
              <div className="w-9 h-9 aspect-square rounded-full relative">
                <Image
                  src={
                    (message.sender === user?.displayName
                      ? user?.photoURL?.toString()
                      : userChat?.profileImage.toString()) || ""
                  }
                  alt=" "
                  height={100}
                  width={100}
                  className="absolute w-full h-full object-cover object-center rounded-full"
                />
              </div>
              <div
                className={`max-w-[350px] text-end ${
                  message.sender === user?.displayName
                    ? "bg-third-color"
                    : "bg-neutral-300"
                } p-3 rounded-lg`}
              >
                {message.message}
              </div>
            </div>
          ))}
      </div>
      <div className="flex items-center border-t dark:border-white/10 border-black/20 text-white justify-between">
        <div className="px-4 h-full w-full">
          <input
            className="w-full h-full bg-transparent outline-none text-black dark:text-white "
            placeholder="Enter message"
            value={messageText}
            onChange={messageTextHandler}
            onKeyDown={EnterSendHandler}
          />
        </div>
        <div
          className="w-12 aspect-square flex justify-center items-center dark:bg-white/5 bg-secondary-dark rounded-br-lg cursor-pointer"
          onClick={sendHandler}
        >
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="w-4 h-4 aspect-square text-white dark:text-third-color flex-shrink-0"
          />
        </div>
      </div>
    </div>
  );
};
