"use client";
import React, { useState } from "react";
import { ArrowLeft, Settings, Plus, Bot, Zap, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AssistantsPage() {
  const router = useRouter();
  const [assistants, setAssistants] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [assistantName, setAssistantName] = useState("Document Assistant");
  const [instructions, setInstructions] =
    useState(`You are a helpful assistant that can analyze documents and search the web for current information.

IMPORTANT INSTRUCTIONS:
- When users ask about current events, recent news, latest information, today's data, current prices, weather, stock prices, or anything that requires up-to-date information, you should search the web for the most recent and accurate information.
- Always verify information when possible and provide multiple sources when available.
- Be concise but thorough in your responses.
- If you're not sure about something, acknowledge the uncertainty and suggest ways to verify the information.`);

  const handleGoBack = () => {
    router.back();
  };

  const handleCreateAssistant = () => {
    setShowCreateModal(true);
  };

  const handleCreateFirstAssistant = () => {
    setShowCreateModal(true);
  };

  const handleCancel = () => {
    setShowCreateModal(false);
  };

  const handleSubmitAssistant = () => {
    // TODO: Implement actual assistant creation
    const newAssistant = {
      id: Date.now(),
      name: assistantName,
      description: instructions.split("\n")[0],
      model: "GPT-4",
      instructions: instructions,
    };

    setAssistants([...assistants, newAssistant]);
    setShowCreateModal(false);
    setAssistantName("Document Assistant");
    setInstructions(`You are a helpful assistant that can analyze documents and search the web for current information.

IMPORTANT INSTRUCTIONS:
- When users ask about current events, recent news, latest information, today's data, current prices, weather, stock prices, or anything that requires up-to-date information, you should search the web for the most recent and accurate information.
- Always verify information when possible and provide multiple sources when available.
- Be concise but thorough in your responses.
- If you're not sure about something, acknowledge the uncertainty and suggest ways to verify the information.`);
  };

  return (
    <>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-[var(--background)]"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="border-b"
          style={{
            background: "var(--surface-elevated)",
            borderColor: "var(--border-light)",
          }}
        >
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={handleGoBack}
                className="p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft size={20} color="var(--text-secondary)" />
              </motion.button>
              <div>
                <div className="flex items-center gap-2">
                  <h1
                    className="text-2xl font-bold"
                    style={{ color: "var(--primary)" }}
                  >
                    OpenAI Assistants
                  </h1>
                  <motion.div
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Sparkles size={20} color="var(--primary)" />
                  </motion.div>
                </div>
                <p
                  className="text-sm mt-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Select or create an AI assistant
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="p-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2
              className="text-xl font-bold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Your AI Assistants
            </h2>
            <p
              className="text-sm mb-8"
              style={{ color: "var(--text-secondary)" }}
            >
              Select an existing assistant or create a new one
            </p>
          </motion.div>

          {/* Empty State */}
          {assistants.length === 0 && (
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center justify-center py-20"
            >
              {/* Robot Icon */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-8"
              >
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center"
                  style={{
                    background: "var(--surface-secondary)",
                    border: "2px solid var(--border-light)",
                  }}
                >
                  <Bot size={40} color="var(--text-tertiary)" />
                </div>
              </motion.div>

              {/* No Assistants Message */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-center max-w-md"
              >
                <h3
                  className="text-xl font-semibold mb-4"
                  style={{ color: "var(--text-primary)" }}
                >
                  No Assistants Yet
                </h3>
                <p
                  className="text-sm leading-relaxed mb-8"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Create your first AI assistant to start analyzing documents
                  and having intelligent conversations.
                </p>

                {/* Create First Assistant Button */}
                <motion.button
                  onClick={handleCreateFirstAssistant}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white mx-auto cursor-pointer"
                  style={{
                    background: "var(--sidebar-active-bg)",
                  }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <Plus size={16} />
                  Create First Assistant
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* Assistants Grid (when assistants exist) */}
          {assistants.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {assistants.map((assistant, index) => (
                <motion.div
                  key={assistant.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 rounded-lg border cursor-pointer hover:shadow-lg transition-all"
                  style={{
                    background: "var(--surface-elevated)",
                    borderColor: "var(--border-light)",
                  }}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: "var(--primary-light)" }}
                    >
                      <Bot size={20} color="var(--primary)" />
                    </div>
                    <div>
                      <h3
                        className="font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {assistant.name}
                      </h3>
                      <p
                        className="text-xs"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        {assistant.model}
                      </p>
                    </div>
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {assistant.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.main>

      {/* Create Assistant Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-opacity-5 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
            onClick={handleCancel}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-center text-white">
                <motion.div
                  className="mb-4 size-16 rounded-full bg-primary mx-auto flex items-center justify-center"
                >
                    <Bot size={32} className="text-white" />
                </motion.div>
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold mb-2"
                >
                  Create Your AI Assistant
                </motion.h2>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-blue-100"
                >
                  Set up your personalized assistant to help with document
                  analysis
                </motion.p>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-6"
                >
                  {/* Assistant Name */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Assistant Name
                    </label>
                    <input
                      type="text"
                      value={assistantName}
                      onChange={(e) => setAssistantName(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      style={{
                        background: "var(--surface)",
                        borderColor: "var(--border-medium)",
                        color: "var(--text-primary)",
                      }}
                      placeholder="Enter assistant name"
                    />
                  </div>

                  {/* Instructions */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Instructions
                    </label>
                       <textarea
                       value={instructions}
                       onChange={(e) => setInstructions(e.target.value)}
                       className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none overflow-y-auto"
                       style={{
                         background: "var(--surface)",
                         borderColor: "var(--border-medium)",
                         color: "var(--text-primary)",
                         height: "200px",
                         maxHeight: "200px",
                         minHeight: "200px",
                       }}
                       placeholder="Describe what your assistant should do..."
                     />
                  </div>
                </motion.div>

                {/* Modal Actions */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex justify-end gap-4 mt-8"
                >
                  <motion.button
                    onClick={handleCancel}
                    className="px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer"
                    style={{
                      color: "var(--text-secondary)",
                      background: "var(--surface-secondary)",
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleSubmitAssistant}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Zap size={16} />
                    Create Assistant
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
