"use client";

import { Briefcase, User, Sparkles, HelpCircle, ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCases as useCaseData } from "./usecase";
import IndustrySelection from "./components/IndustrySelection";
import BusinessUseCaseSelection from "./components/BusinessUseCaseSelection";
import { getUseCasesForIndustry } from "./components/BusinessUseCaseData";

const CreateAgent = () => {
  const [step, setStep] = useState(1);
  const [selectedAgentType, setSelectedAgentType] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [customIndustry, setCustomIndustry] = useState("");
  const [selectedUseCase, setSelectedUseCase] = useState(null);
  const [customUseCase, setCustomUseCase] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const [agentName, setAgentName] = useState("");
  const [firstMessage, setFirstMessage] = useState("");

  const router = useRouter();

  const useCases = useCaseData;

  const businessUseCases =
    selectedAgentType === "business" && selectedIndustry
      ? getUseCasesForIndustry(
          selectedIndustry === "other" ? "default" : selectedIndustry
        )
      : [];

  const handleAgentTypeSelect = (type) => {
    setSelectedAgentType(type);

    if (type === "business") {
      setStep(1.5);
    } else {
      setStep(2);
    }
  };

  const handleUseCaseSelect = (useCase) => {
    if (useCase === "other") {
      setSelectedUseCase(useCase);
      return;
    }

    setSelectedUseCase(useCase);
    setCustomUseCase("");

    if (selectedAgentType === "business") {
      const selectedBusinessUseCase = businessUseCases.find(
        (uc) => uc.id === useCase
      );
      const useCaseName = selectedBusinessUseCase?.title || "Business Agent";
      setAgentName(useCaseName);
      setFirstMessage(selectedBusinessUseCase?.first_message || "");
    } else {
      const selectedUseCaseData = useCases.find((uc) => uc.id === useCase);
      const useCaseName = selectedUseCaseData?.title || "New Agent";
      setAgentName(useCaseName);
      setFirstMessage(selectedUseCaseData?.first_message || "");
    }

    setStep(3);
  };

  const handleCustomUseCaseContinue = () => {
    if (!customUseCase.trim()) {
      alert("Please enter a custom use case");
      return;
    }

    setAgentName(customUseCase);
    setFirstMessage("");
    setStep(3);
  };

  const handleCreateAgent = async () => {
    if (!agentName.trim()) {
      alert("Please enter agent name");
      return;
    }

    if (!firstMessage.trim()) {
      alert("Please enter first message");
      return;
    }

    setIsCreating(true);
    try {
      let systemPrompt = "";

      // Get system prompt based on agent type
      if (selectedAgentType === "business") {
        const selectedBusinessUseCase = businessUseCases.find(
          (uc) => uc.id === selectedUseCase
        );
        systemPrompt = selectedBusinessUseCase?.system_prompt || "";
      } else {
        const selectedUseCaseData = useCases.find(
          (uc) => uc.id === selectedUseCase
        );
        systemPrompt = selectedUseCaseData?.system_prompt || "";
      }

      const conversationConfig = {
        agent: {
          first_message: firstMessage,
        },
      };

      if (systemPrompt) {
        conversationConfig.agent.prompt = {
          prompt: systemPrompt,
        };
      }

      const payload = {
        name: agentName,
        conversation_config: conversationConfig,
        metadata: {
          agent_type: selectedAgentType,
          use_case:
            selectedUseCase === "other" ? customUseCase : selectedUseCase,
        },
      };

      if (selectedAgentType === "business") {
        payload.metadata.industry =
          selectedIndustry === "other" ? customIndustry : selectedIndustry;
      }

      const response = await fetch("/api/voice-agent/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create agent");
      }

      const data = await response.json();

      if (data.agent_id) {
        router.push(`/voice-agents/detail/${data.agent_id}`);
      }
    } catch (error) {
      console.error("Error creating agent:", error);
      alert("Failed to create agent. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleIndustrySelect = (industry) => {
    if (industry === "other") {
      setSelectedIndustry(industry);
      return;
    }

    setSelectedIndustry(industry);
    setCustomIndustry("");
    setStep(2);
  };

  const handleCustomIndustryContinue = () => {
    if (!customIndustry.trim()) {
      alert("Please enter a custom industry");
      return;
    }

    setStep(2);
  };

  const handleBack = () => {
    if (step === 3) {
      if (selectedAgentType === "business") {
        setStep(2);
      } else {
        setStep(2);
      }
    } else if (step === 2) {
      if (selectedAgentType === "business") {
        setStep(1.5);
      } else {
        setStep(1);
      }
      setSelectedUseCase(null);
      setCustomUseCase("");
    } else if (step === 1.5) {
      setStep(1);
      setSelectedIndustry(null);
      setCustomIndustry("");
    } else {
      router.push("/voice-agents");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen flex flex-col">
      {step === 1 && (
        <>
          <div className="mb-8 flex items-center gap-4">
            <button className="cursor-pointer" onClick={() => router.back()}>
              <ArrowLeft className="size-6 text-(--text-secondary)" />
            </button>
            <h1
              className="text-2xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              New agent
            </h1>
          </div>

          <div className="gap-4 max-w-3xl mx-auto flex flex-col flex-1 w-full">
            <button
              onClick={() => handleAgentTypeSelect("blank")}
              disabled={isCreating}
              className="group relative w-full p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--surface)",
                borderColor:
                  hoveredCard === "blank"
                    ? "var(--primary)"
                    : "var(--border-light)",
              }}
              onMouseEnter={() => setHoveredCard("blank")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex-shrink-0 size-12 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor:
                      hoveredCard === "blank"
                        ? "var(--primary-light)"
                        : "var(--surface-secondary)",
                  }}
                >
                  <Sparkles
                    className="w-6 h-6 transition-all duration-300"
                    style={{
                      color:
                        hoveredCard === "blank"
                          ? "var(--primary)"
                          : "var(--text-secondary)",
                    }}
                  />
                </div>
                <div className="text-left">
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Blank Agent
                  </h3>
                </div>
              </div>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
              <button
                onClick={() => handleAgentTypeSelect("personal")}
                disabled={isCreating}
                className="group relative p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor:
                    hoveredCard === "personal"
                      ? "var(--primary)"
                      : "var(--border-light)",
                }}
                onMouseEnter={() => setHoveredCard("personal")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex flex-col h-full">
                  <div className="mb-6 space-y-3">
                    <div className="flex justify-end">
                      <div
                        className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-tr-sm"
                        style={{
                          backgroundColor: "var(--surface-elevated)",
                          color: "var(--text-primary)",
                        }}
                      >
                        <p className="text-sm">
                          Could you see whether I have any urgent outstanding
                          emails?
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <div
                        className="flex-shrink-0 size-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "var(--primary)" }}
                      >
                        <User
                          className="w-4 h-4"
                          style={{ color: "var(--text-inverse)" }}
                        />
                      </div>
                      <div
                        className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-tl-sm"
                        style={{
                          backgroundColor: "var(--surface-secondary)",
                          color: "var(--text-primary)",
                        }}
                      >
                        <p className="text-sm">Sure, let me check.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <div
                        className="flex-shrink-0 size-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "var(--primary)" }}
                      >
                        <User
                          className="w-4 h-4"
                          style={{ color: "var(--text-inverse)" }}
                        />
                      </div>
                      <div
                        className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-tl-sm"
                        style={{
                          backgroundColor: "var(--surface-secondary)",
                          color: "var(--text-primary)",
                        }}
                      >
                        <p className="text-sm">
                          You've got one urgent email from your manager about
                          tomorrow's meeting. Want a quick summary?
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="flex items-center gap-3 mt-auto">
                    <div
                      className="flex-shrink-0 size-10 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor:
                          hoveredCard === "personal"
                            ? "var(--primary-light)"
                            : "var(--surface-secondary)",
                      }}
                    >
                      <User
                        className="w-5 h-5"
                        style={{
                          color:
                            hoveredCard === "personal"
                              ? "var(--primary)"
                              : "var(--text-secondary)",
                        }}
                      />
                    </div>
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Personal Assistant
                    </h3>
                  </div>
                </div>
              </button>

              {/* Business Agent */}
              <button
                onClick={() => handleAgentTypeSelect("business")}
                disabled={isCreating}
                className="group relative p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor:
                    hoveredCard === "business"
                      ? "var(--primary)"
                      : "var(--border-light)",
                }}
                onMouseEnter={() => setHoveredCard("business")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex flex-col h-full">
                  {/* Chat Preview */}
                  <div className="mb-6 space-y-3">
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div
                        className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-tr-sm"
                        style={{
                          backgroundColor: "var(--surface-elevated)",
                          color: "var(--text-primary)",
                        }}
                      >
                        <p className="text-sm">
                          Can you tell me more about pricing?
                        </p>
                      </div>
                    </div>

                    {/* Agent Response */}
                    <div className="flex items-start gap-2">
                      <div
                        className="flex-shrink-0 size-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "var(--primary)" }}
                      >
                        <Briefcase
                          className="w-4 h-4"
                          style={{ color: "var(--text-inverse)" }}
                        />
                      </div>
                      <div
                        className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-tl-sm"
                        style={{
                          backgroundColor: "var(--surface-secondary)",
                          color: "var(--text-primary)",
                        }}
                      >
                        <p className="text-sm">
                          Absolutely! We offer three plans, Starter, Pro, and
                          Enterprise. Want a quick breakdown, or should I help
                          you pick the best fit?
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="flex items-center gap-3 mt-auto">
                    <div
                      className="flex-shrink-0 size-10 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor:
                          hoveredCard === "business"
                            ? "var(--primary-light)"
                            : "var(--surface-secondary)",
                      }}
                    >
                      <Briefcase
                        className="w-5 h-5"
                        style={{
                          color:
                            hoveredCard === "business"
                              ? "var(--primary)"
                              : "var(--text-secondary)",
                        }}
                      />
                    </div>
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Business Agent
                    </h3>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Step 1.5: Industry Selection (for Business Agent) */}
      {step === 1.5 && (
        <IndustrySelection
          selectedIndustry={selectedIndustry}
          customIndustry={customIndustry}
          hoveredCard={hoveredCard}
          onIndustrySelect={handleIndustrySelect}
          onCustomIndustryChange={setCustomIndustry}
          onCustomIndustryContinue={handleCustomIndustryContinue}
          onBack={handleBack}
          setHoveredCard={setHoveredCard}
        />
      )}

      {/* Step 2: Use Case Selection */}
      {step === 2 && selectedAgentType === "business" ? (
        <BusinessUseCaseSelection
          useCases={businessUseCases}
          selectedUseCase={selectedUseCase}
          customUseCase={customUseCase}
          hoveredCard={hoveredCard}
          onUseCaseSelect={handleUseCaseSelect}
          onCustomUseCaseChange={setCustomUseCase}
          onCustomUseCaseContinue={handleCustomUseCaseContinue}
          onBack={handleBack}
          setHoveredCard={setHoveredCard}
        />
      ) : step === 2 ? (
        <>
          <div className="mb-8 flex items-center gap-4">
            <button className="cursor-pointer" onClick={handleBack}>
              <ArrowLeft className="size-6 text-(--text-secondary)" />
            </button>
            <div className="flex flex-col">
              <h1
                className="text-2xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Use case
              </h1>
              <div
                className="text-base"
                style={{ color: "var(--text-secondary)" }}
              >
                What will your agent help with?
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto w-full flex-1">
            {/* Use Case Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
              {useCases.map((useCase) => {
                const Icon = useCase.icon;
                return (
                  <button
                    key={useCase.id}
                    onClick={() => handleUseCaseSelect(useCase.id)}
                    className="p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg"
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor:
                        hoveredCard === useCase.id
                          ? "var(--primary)"
                          : "var(--border-light)",
                    }}
                    onMouseEnter={() => setHoveredCard(useCase.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div
                        className="size-12 rounded-full flex items-center justify-center transition-all duration-300"
                        style={{
                          backgroundColor:
                            hoveredCard === useCase.id
                              ? "var(--primary-light)"
                              : "var(--surface-secondary)",
                        }}
                      >
                        <Icon
                          className="w-6 h-6 transition-all duration-300"
                          style={{
                            color:
                              hoveredCard === useCase.id
                                ? "var(--primary)"
                                : "var(--text-secondary)",
                          }}
                        />
                      </div>
                      <h3
                        className="text-base font-medium text-center"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {useCase.title}
                      </h3>
                    </div>
                  </button>
                );
              })}

              {/* Other Option */}
              <button
                onClick={() => handleUseCaseSelect("other")}
                className="p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor:
                    selectedUseCase === "other"
                      ? "var(--primary)"
                      : hoveredCard === "other"
                      ? "var(--primary)"
                      : "var(--border-light)",
                }}
                onMouseEnter={() => setHoveredCard("other")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="size-12 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      backgroundColor:
                        selectedUseCase === "other" || hoveredCard === "other"
                          ? "var(--primary-light)"
                          : "var(--surface-secondary)",
                    }}
                  >
                    <HelpCircle
                      className="w-6 h-6 transition-all duration-300"
                      style={{
                        color:
                          selectedUseCase === "other" || hoveredCard === "other"
                            ? "var(--primary)"
                            : "var(--text-secondary)",
                      }}
                    />
                  </div>
                  <h3
                    className="text-base font-medium text-center"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Other
                  </h3>
                </div>
              </button>
            </div>

            {/* Custom Use Case Input - shown when Other is selected */}
            {selectedUseCase === "other" && (
              <div className="max-w-2xl mx-auto mb-6 flex gap-3 items-center">
                <input
                  type="text"
                  value={customUseCase}
                  onChange={(e) => setCustomUseCase(e.target.value)}
                  placeholder="e.g., Lead qualification, Customer onboarding..."
                  className="flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none"
                  style={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border-light)",
                    color: "var(--text-primary)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--primary)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border-light)";
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customUseCase.trim()) {
                      handleCustomUseCaseContinue();
                    }
                  }}
                />
                <button
                  onClick={handleCustomUseCaseContinue}
                  disabled={isCreating || !customUseCase.trim()}
                  className="px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--text-inverse)",
                  }}
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </>
      ) : null}

      {/* Step 3: Agent Configuration */}
      {step === 3 && (
        <>
          <div className="mb-8 flex items-center gap-4">
            <button className="cursor-pointer" onClick={handleBack}>
              <ArrowLeft className="size-6 text-(--text-secondary)" />
            </button>
            <div className="flex-1">
              <h1
                className="text-2xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Configure your agent
              </h1>
              <p
                className="text-base"
                style={{ color: "var(--text-secondary)" }}
              >
                Customize your agent's name and first message
              </p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
            <div className="space-y-6 mb-8">
              {/* Agent Name */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Agent Name
                </label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="e.g., Personal Assistant"
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none"
                  style={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border-light)",
                    color: "var(--text-primary)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--primary)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border-light)";
                  }}
                />
              </div>

              {/* First Message */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  First Message
                  <span
                    className="ml-2 text-xs font-normal"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    What your agent will say when starting a conversation
                  </span>
                </label>
                <textarea
                  value={firstMessage}
                  onChange={(e) => setFirstMessage(e.target.value)}
                  placeholder="e.g., Hello! I'm your personal assistant. How can I help you today?"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none resize-none"
                  style={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border-light)",
                    color: "var(--text-primary)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--primary)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border-light)";
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end mt-8">
              <button
                onClick={handleCreateAgent}
                disabled={
                  isCreating || !agentName.trim() || !firstMessage.trim()
                }
                className="px-8 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--text-inverse)",
                }}
              >
                Create Agent
              </button>
            </div>
          </div>
        </>
      )}

      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="p-6 rounded-xl shadow-xl"
            style={{ backgroundColor: "var(--surface)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                style={{
                  borderColor: "var(--primary)",
                  borderTopColor: "transparent",
                }}
              ></div>
              <p style={{ color: "var(--text-primary)" }}>Creating agent...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAgent;
