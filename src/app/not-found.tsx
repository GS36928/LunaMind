"use client";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import styles from "./NotFound.module.css";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const [animationData, setAnimationData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/animations/404.json")
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => console.error("Error loading animation:", error));
  }, []);

  // if (!animationData) return <div>Loading animation...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Evectus</h1>

      <div className={styles.content}>
        <Lottie
          animationData={animationData}
          loop={true}
          autoplay={true}
          style={{
            width: "100%",
            maxWidth: "600px",
            height: "auto",
            marginBottom: "32px",
          }}
        />

        <div className={styles.errorCode}>404</div>

        <p className={styles.description}>
          თქვენს მიერ მოთხოვნილი გვერდი არ არსებობს
        </p>

        <button className={styles.button} onClick={() => router.push("/")}>
          მთავარი გვერდი
        </button>
      </div>
    </div>
  );
}
