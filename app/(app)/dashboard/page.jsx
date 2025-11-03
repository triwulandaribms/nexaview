"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const fullName = decodedToken.name || decodedToken.username || "User";
        setUserName(fullName);
      } catch (error) {
        console.error("Failed to decode token:", error);
        setUserName("User");
      }
    } else {
      console.log("Token not found.");
      setUserName("User");
    }
  }, []);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[var(--background)]"
    >
      <div>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 lg:mb-12"
        >
          <h1 className="text-2xl lg:text-3xl font-bold mb-4">
            Hi, {userName}
          </h1>
          <p className="ttext-xl text-[var(--text-muted)]">
            Design, deploy, and manage AI-driven applications customized for
            your specific needs.
          </p>
        </motion.div>
      </div>
    </motion.main>
  );
}
