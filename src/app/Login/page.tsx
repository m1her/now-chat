"use client";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/firebase-config";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

const Login = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((loggedUser) => {
      const docRef = doc(
        collection(db, "/users/"),
        loggedUser.user.email?.toString()
      );
      const data = {
        chats: [],
        name: loggedUser.user.displayName,
        profileImage: loggedUser.user.photoURL,
      };
      setDoc(docRef, data);
    });
  };

  useEffect(() => {
    if (user) {
      router.push("/Home");
    }
  }, [user]);

  return (
    <div className="w-full min-h-screen h-full flex justify-center items-center">
      <div className="p-8 min-w-[500px] border border-black/20 shadow-lg bg-white dark:bg-white/5 rounded-lg flex flex-col items-center">
        <div className="dark:text-primary-light text-secondary-dark text-4xl font-bold">
          Now Chat
        </div>
        <button
          className="flex  items-center bg-secondary-dark dark:bg-white rounded p-0.5 mt-5"
          onClick={googleSignIn}
        >
          <FontAwesomeIcon
            icon={faGoogle}
            className="w-4 h-4 p-3 bg-white rounded text-secondary-dark dark:bg-secondary-dark dark:text-white"
          />
          <div className="text-white dark:text-secondary-dark font-semibold dark:font-bold mx-2">
            Sign in with Google
          </div>
        </button>
      </div>
    </div>
  );
};

export default Login;
