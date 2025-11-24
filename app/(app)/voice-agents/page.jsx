"use client";

import { Bot, Edit, Plus, Trash2 } from "lucide-react";
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
    router.push(`/voice-agents/detail/${agentId}`);
  };

  const handleDeleteAgent = async (agentId) => {
    if (!confirm("Are you sure you want to delete this agent?")) {
      return;
    }

    try {
      const response = await fetch(`/api/voice-agent/${agentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setVoiceAgents(
          voiceAgents.filter((agent) => agent.agent_id !== agentId)
        );
      } else {
        console.error("Failed to delete agent");
        alert("Failed to delete agent");
      }
    } catch (error) {
      console.error("Error deleting agent:", error);
      alert("Error deleting agent");
    }
  };

  const handleCreateAgent = async () => {
    const response = await fetch("/api/voice-agent/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "New Agent",
        conversation_config: {
          agent: {
            first_message: "",
          },
        },
      }),
    });
    const data = await response.json();

    if (response.ok) {
      router.push(`/voice-agents/detail/${data.agent_id}`);
    }
  };

  return (
    <div className=" p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-2xl font-semibold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Voice Agents
        </h1>
        <button
          onClick={handleCreateAgent}
          className="px-4 py-2 rounded-md font-medium hover:opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center cursor-pointer"
          style={{
            background: "var(--primary)",
            color: "var(--text-inverse)",
          }}
        >
          <Plus className="h-4 w-4" />
          New Agent
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10 items-start ">
        {voiceAgents.map((voiceAgent, index) => (
          <button
            key={index}
            className="relative h-full py-12 px-6 flex gap-4 items-center overflow-hidden bg-(--surface) hover:shadow-md rounded-md  text-left transition-all duration-300 border border-(--border-light)"
          >
            <div className="absolute top-4 right-4 flex gap-4">
              <div
                className="cursor-pointer"
                onClick={() => openEdit(voiceAgent.agent_id)}
              >
                <Edit className="w-4 h-4 text-(--text-secondary) hover:text-(--primary)" />
              </div>
              <div
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteAgent(voiceAgent.agent_id);
                }}
              >
                <Trash2 className="w-4 h-4 text-(--text-secondary) hover:text-red-500" />
              </div>
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
