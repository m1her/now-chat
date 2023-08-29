"use client";
import ChatsSearch, { SearchedUsersProps } from "@/components/ChatsSearch";
import Filters from "@/components/Filters";
import { NavBar } from "@/components/NavBar";
import { auth, db } from "@/firebase-config";
import { faPaperPlane, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const Home = () => {
  const [user] = useAuthState(auth);
  const [filter, setFilter] = useState(0);
  const [userChat, setUserChat] = useState<SearchedUsersProps>();

  useEffect(() => {
    // if (user && user.email) {
    //   const docRef = doc(
    //     collection(db, "/chats/"),
    //     `${user?.email.split("@")[0]}-${userChat?.email.split("@")[0]}`
    //   );
    //   setDoc(docRef, {});
    //   const messagesCollectionRef = collection(docRef, "messages");
    //   addDoc(messagesCollectionRef, { text: "say hello" });
    // }
    getDocs(collection(db, "/chats/")).then((chat) =>
      chat.docs.map((item) => console.log(item.id))
    );
    //idk then filter then display
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
            <div className="dark:text-white text-black">Chat 1</div>
            <div className="dark:text-white text-black">Chat 2</div>
            <div className="dark:text-white text-black">Chat 3</div>
          </div>
        </div>
        {userChat && (
          <div className="col-span-2 flex flex-col justify-between h-full dark:bg-white/5 bg-white rounded-lg">
            <div className="flex items-center py-2.5 px-4 border-b dark:border-white/10 border-black/5">
              <div className="w-10 h-10 aspect-square rounded-full relative">
                {user?.photoURL && (
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

            <div className="flex items-center border-t dark:border-white/10 border-black/20 text-white justify-between">
              <div className="px-4 h-full w-full">
                <input
                  className="w-full h-full bg-transparent outline-none text-black dark:text-white "
                  placeholder="Enter message"
                />
              </div>
              <div className="w-12 aspect-square flex justify-center items-center dark:bg-white/5 bg-secondary-dark rounded-br-lg cursor-pointer">
                <FontAwesomeIcon
                  icon={faPaperPlane}
                  className="w-4 h-4 aspect-square text-white dark:text-third-color flex-shrink-0"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Home;
