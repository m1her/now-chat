import { messagesType } from "@/components/ChatBox";
import { DocumentData, Query, getDocs } from "firebase/firestore";

type setMessagesFunctionProps = {
  messagesQuery: Query<DocumentData, DocumentData>;
  setLastStanpshot: React.Dispatch<any>;
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
  setMessages: React.Dispatch<React.SetStateAction<messagesType>>;
  next?: boolean;
};

export const setMessagesFunction = ({
  messagesQuery,
  setHasMore,
  setLastStanpshot,
  setMessages,
  next,
}: setMessagesFunctionProps) => {
  getDocs(messagesQuery)
    .then((querySnapshot) => {
      const latestMessages: React.SetStateAction<messagesType> = [];
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
        if (next) {
          setMessages((prev) => [...prev, ...latestMessages]);
        } else {
          setMessages(latestMessages);
        }
        const lastVisible = first.docs[first.docs.length - 1];
        setLastStanpshot(lastVisible);
      }
    })
    .catch((error) => {
      setHasMore(false);
      console.error("Error getting documents:", error);
    });
};
