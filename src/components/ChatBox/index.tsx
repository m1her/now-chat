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
  onSnapshot,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase-config";
import { User } from "firebase/auth";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spinner } from "../Spinner";

type ChatBoxProps = {
  userChat: SearchedUsersProps;
  chatId: string;
  user: User | null | undefined;
};

export const ChatBox = ({ userChat, chatId, user }: ChatBoxProps) => {
  const [messageText, setMessageText] = useState("");
  const [lastStanpshot, setLastStanpshot] = useState<any>();
  const [hasMore, setHasMore] = useState<boolean>(true);
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
    if (user && messageText != "" && messageText) {
      const docRef = doc(collection(db, "/chats/"), chatId);
      const messagesCollectionRef = collection(docRef, "messages");
      addDoc(messagesCollectionRef, {
        message: messageText,
        sender: user.displayName,
        time: new Date(),
      });
      const messagesQuery = query(
        messagesCollectionRef,
        orderBy("time", "desc"),
        limit(10)
      );

      onSnapshot(messagesQuery, (querySnapshot) => {
        const chatData: any[] = [];
        querySnapshot.forEach((doc) => {
          chatData.push({
            id: doc.id,
            message: doc.data().message,
            sender: doc.data().sender,
            time: doc.data().time,
          });
        });
        setMessages(chatData);

        if (messages.length >= 14) {
          const first = querySnapshot;
          const lastVisible = first.docs[first.docs.length - 1];
          setLastStanpshot(lastVisible);
          setHasMore(true);
        }
      });

      const collRec = collection(db, "/users/", userChat.email, "chats");
      const notifyUserRef = doc(
        collection(db, "/users/", userChat.email, "chats"),
        user.email?.toString()
      );
      getDocs(collRec).then((doc) => {
        const findChat = doc.docs.find(
          (doc) => doc.id == user.email?.toString()
        );
        if (!findChat) {
          setDoc(notifyUserRef, {
            email: user?.email,
            name: user?.displayName,
            profileImage: user.photoURL,
            lastUpdated: new Date().toString(),
            seen: false,
          });
        }
      });

      updateDoc(notifyUserRef, { seen: false });
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
          const first = querySnapshot;
          querySnapshot.forEach((doc) => {
            latestMessages.push({
              id: doc.id,
              message: doc.data().message,
              sender: doc.data().sender,
              time: doc.data().time,
            });
          });
          if (first.empty) {
            setHasMore(false);
          } else {
            setHasMore(true);
            setMessages(latestMessages);
            const lastVisible = first.docs[first.docs.length - 1];
            setLastStanpshot(lastVisible);
          }
        })
        .catch((error) => {
          setHasMore(false);
          console.error("Error getting documents:", error);
        });
    }
  }, [chatId]);

  const loadNextMessages = () => {
    console.log("haai");
    const docRef = doc(collection(db, "/chats/"), chatId);
    const messagesCollectionRef = collection(docRef, "messages");

    const next = query(
      messagesCollectionRef,
      orderBy("time", "desc"),
      startAfter(lastStanpshot),
      limit(10)
    );

    const latestMessages: React.SetStateAction<
      {
        id: string;
        message: string;
        sender: string;
        time: string;
      }[]
    > = [];
    getDocs(next)
      .then((querySnapshot) => {
        const next = querySnapshot;
        querySnapshot.forEach((doc) => {
          latestMessages.push({
            id: doc.id,
            message: doc.data().message,
            sender: doc.data().sender,
            time: doc.data().time,
          });
        });
        if (next.empty) {
          setHasMore(false);
        } else {
          setHasMore(true);
          setMessages((prev) => [...prev, ...latestMessages]);
          const lastVisible = next.docs[next.docs.length - 1];
          setLastStanpshot(lastVisible);
        }
      })
      .catch((error) => {
        setHasMore(false);
        console.error("Error getting documents:", error);
      });
  };

  return (
    <div className="md:col-span-2 col-span-3 flex flex-col justify-between h-full dark:bg-white/5 bg-white rounded-lg">
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
      <div
        className="w-full overflow-y-scroll h-[65vh] flex flex-col-reverse gap-y-2 p-2"
        id="scrollableDiv"
      >
        <InfiniteScroll
          next={loadNextMessages}
          hasMore={hasMore}
          loader={
            <div className="w-full flex justify-center">
              <Spinner />
            </div>
          }
          dataLength={messages.length}
          style={{
            display: "flex",
            flexDirection: "column-reverse",
            rowGap: "0.5rem",
            overflow: "hidden",
          }}
          inverse={true}
          scrollableTarget="scrollableDiv"
        >
          {messages &&
            messages.map((message, index) => {
              const previousMessage = messages[index + 1];
              const hideImage =
                previousMessage && previousMessage.sender === message.sender;

              return (
                <div
                  key={message.id}
                  className="flex gap-x-2 items-start"
                  dir={message.sender === user?.displayName ? "rtl" : "ltr"}
                >
                  <div className="w-9 h-9 aspect-square rounded-full relative">
                    {!hideImage && (
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
                    )}
                  </div>
                  <div
                    className={`max-w-[350px] text-end ${
                      message.sender === user?.displayName
                        ? "dark:bg-third-color dark:text-black text-white bg-secondary-dark"
                        : "bg-neutral-300"
                    } p-3 rounded-lg`}
                  >
                    {message.message}
                  </div>
                </div>
              );
            })}
        </InfiniteScroll>
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
