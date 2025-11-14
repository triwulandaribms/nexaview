"use client";

import { Bot, Edit } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const VoiceAgent = () => {
  const [voiceAgents, setVoiceAgents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchVoiceAgents = async () => {
      try {
        const response = await fetch("/api/voice-agent");
        const data = await response.json();
        setVoiceAgents(data.agents || []);
      } catch (error) {
        console.error("Error fetching voice agents:", error);
      }
    };
    fetchVoiceAgents();
  }, []);

  const openEdit = (agentId) => {
    router.push(`/voice-agents/edit/${agentId}`);
  };
  return (
    <div className=" p-4 sm:p-6 lg:p-8">
      <h1
        className="text-2xl font-semibold mb-2"
        style={{ color: "var(--text-primary)" }}
      >
        Voice Agents
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10 items-start ">
        {voiceAgents.map((voiceAgent, index) => (
          <button
            key={index}
            className="relative h-full py-12 px-6 flex gap-4 items-center overflow-hidden bg-(--surface) hover:shadow-md rounded-md  text-left transition-all duration-300 border border-(--border-light)"
          >
            <div
              className="cursor-pointer absolute top-4 right-4"
              onClick={() => openEdit(voiceAgent.agent_id)}
            >
              <Edit className="w-4 h-4 text-(--text-secondary)" />
            </div>
            <div className="absolute top-0 left-0 w-full h-[4px] bg-(--primary)"></div>
            <div className="size-12 rounded-md bg-(--primary) flex items-center justify-center">
              <Bot className="w-6 h-6 text-(--text-inverse)" />
            </div>
            <div className="lg:text-lg flex-1 leading-[20px]">
              {voiceAgent.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VoiceAgent;
