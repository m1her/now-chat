"use client";
import { ChatBox } from "@/components/ChatBox";
import { Chats } from "@/components/Chats";
import ChatsSearch, { SearchedUsersProps } from "@/components/ChatsSearch";
import Filters from "@/components/Filters";
import { NavBar } from "@/components/NavBar";
import { auth, db } from "@/firebase-config";
import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const Home = () => {
  const [user] = useAuthState(auth);
  const [filter, setFilter] = useState(0);
  const [userChat, setUserChat] = useState<SearchedUsersProps>();
  const [currentChatId, setCurrentChatId] = useState("");

  useEffect(() => {
    if (user && user.email && userChat) {
      let flag = true;
      getDocs(collection(db, "/chats/"))
        .then((chat) =>
          chat.docs
            .filter((item) => {
              const user1Prefix = user?.email?.split("@")[0];
              const user2Prefix = userChat?.email.split("@")[0];
              const itemId = item.id;

              return (
                itemId.includes(`${user1Prefix}-${user2Prefix}`) ||
                itemId.includes(`${user2Prefix}-${user1Prefix}`)
              );
            })
            .map((item) => {
              setCurrentChatId(item.id);
              flag = false;
            })
        )
        .then(() => {
          if (!currentChatId && currentChatId == "" && user.email && flag) {
            const docRef = doc(
              collection(db, "/chats/"),
              `${user?.email.split("@")[0]}-${userChat?.email.split("@")[0]}`
            );
            setDoc(docRef, {});
            const messagesCollectionRef = collection(docRef, "messages");
            // addDoc(messagesCollectionRef, {});
            setCurrentChatId(docRef.id);
          }
        });
    }
  }, [userChat]);

  return (
    <div className="w-full min-h-screen h-full ">
      <NavBar />
      <div className="w-full h-full min-h-screen grid grid-cols-3 pt-16 pb-8 px-8 gap-x-8">
        <div className="col-span-1 h-full dark:bg-white/5 bg-white rounded-lg">
          <div className="dark:text-white/90 text-black/90 font-semibold p-4 border-b dark:border-white/10 border-black/5 text-lg">
            Chats
          </div>
          <div className="text-sm mt-2 ml-4 flex items-center justify-start w-full gap-x-2 whitespace-nowrap dark:text-white text-black">
            Filter by:
            <Filters filter={setFilter} />
          </div>
          <div className="px-8 mt-2 mb-4 z-50 flex">
            <ChatsSearch select={setUserChat} filter={filter} />
          </div>
          <div className="px-4 flex flex-col gap-y-2 z-10">
            <Chats user={user} select={setUserChat} />
          </div>
        </div>
        {userChat && (
          <ChatBox userChat={userChat} chatId={currentChatId} user={user} />
        )}
      </div>
    </div>
  );
};
export default Home;
