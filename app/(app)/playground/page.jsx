"use client";
import React from "react";
import { MessageCircle, Brain, TrendingUp } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PlaygroundPage() {
  const playgroundItems = [
    {
      id: 1,
      title: "AI Chatbot",
      description:
        "Interactive conversational AI that can answer questions, provide support, and engage with users naturally.",
      category: "Conversational AI",
      icon: MessageCircle,
      color: "from-blue-500 to-blue-600",
      features: [
        "Natural language processing",
        "Context awareness",
        "Multi-language support",
      ],
      ready: true,
      link: "/playground/assistants",
    },
    {
      id: 2,
      title: "Owen AI Assistant",
      description:
        "Powerful conversational AI model that excels at reasoning, coding, and multilingual communication with advanced problem-solving capabilities.",
      category: "AI Models",
      icon: Brain,
      color: "from-orange-500 to-red-500",
      features: [
        "Advanced reasoning",
        "Code generation",
        "Multilingual support",
        "Problem solving",
      ],
      ready: true,
      link: "/playground/qwen",
    },
    {
      id: 3,
      title: "Lead Management System",
      description:
        "Comprehensive lead tracking and management platform with automated follow-ups, sentiment analysis, and conversion optimization.",
      category: "CRM & Sales",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      features: [
        "Lead tracking",
        "Automated follow-ups",
        "Sentiment analysis",
        "Conversion optimization",
      ],
      ready: true,
      link: "/leads",
    },
  ];

  const PlaygroundCard = ({ item, index }) => {
    return (
      <motion.div
        className="overflow-hidden hover:shadow-lg flex flex-col"
        style={{
          background: "var(--surface-elevated)",
          border: "1px solid var(--border-light)",
          boxShadow: "var(--shadow-sm)",
          borderRadius: "10px",
        }}
      >
        {/* Card Header with Icon and Status */}
        <div className={`relative h-32 bg-gradient-to-br ${item.color} p-6`}>
          <div className="flex justify-between items-start">
            <div className="text-white">
              <item.icon size={28} />
            </div>
            {item.ready && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Ready
              </span>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 flex flex-col gap-4 flex-1">
          <div className="flex-1">
            <div className="mb-3">
              <h3
                className="text-xl font-bold mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                {item.title}
              </h3>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--primary)" }}
              >
                {item.category}
              </p>
            </div>

            <p
              className="text-sm mb-4 leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {item.description}
            </p>

            <div className="mb-6">
              <h4
                className="text-sm font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Key Features:
              </h4>
              <ul className="space-y-1">
                {item.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full mr-2"
                      style={{ background: "var(--primary)" }}
                    ></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link href={item.link}>
            <motion.button
              className="w-full py-3 px-4 font-semibold cursor-pointer"
              style={{
                background: "var(--sidebar-active-bg)",
                color: "var(--text-inverse)",
                borderRadius: "10px",
              }}
              whileHover={{ y: -5 }}
            >
              Try It Now
            </motion.button>
          </Link>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[var(--background)]"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div>
          <PageHeader
            title="AI Playground"
            subtitle="Explore our collection of AI-powered tools and capabilities. Try different use cases and see how artificial intelligence can transform your workflow."
          />
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {playgroundItems.map((item, index) => (
            <PlaygroundCard key={item.id} item={item} index={index} />
          ))}
        </motion.div>
      </motion.div>
    </motion.main>
  );
}
