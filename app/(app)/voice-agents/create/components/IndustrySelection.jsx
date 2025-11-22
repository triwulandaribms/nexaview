import React from "react";
import { ArrowLeft } from "lucide-react";
import { industries } from "./IndustryData";

const IndustrySelection = ({
  selectedIndustry,
  customIndustry,
  hoveredCard,
  onIndustrySelect,
  onCustomIndustryChange,
  onCustomIndustryContinue,
  onBack,
  setHoveredCard,
}) => {
  return (
    <>
      <div className="mb-8 flex items-center gap-4">
        <button className="cursor-pointer" onClick={onBack}>
          <ArrowLeft className="size-6 text-(--text-secondary)" />
        </button>
        <div className="flex flex-col">
          <h1
            className="text-2xl font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            What industry is your business in?
          </h1>
          <div className="text-base" style={{ color: "var(--text-secondary)" }}>
            Select the industry that best describes your business
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full flex-1">
        {/* Industry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
          {industries.map((industry) => {
            const Icon = industry.icon;
            const isOther = industry.id === "other";
            return (
              <button
                key={industry.id}
                onClick={() => onIndustrySelect(industry.id)}
                className="p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor:
                    selectedIndustry === industry.id
                      ? "var(--primary)"
                      : hoveredCard === industry.id
                      ? "var(--primary)"
                      : "var(--border-light)",
                }}
                onMouseEnter={() => setHoveredCard(industry.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="size-12 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      backgroundColor:
                        selectedIndustry === industry.id ||
                        hoveredCard === industry.id
                          ? "var(--primary-light)"
                          : "var(--surface-secondary)",
                    }}
                  >
                    <Icon
                      className="w-6 h-6 transition-all duration-300"
                      style={{
                        color:
                          selectedIndustry === industry.id ||
                          hoveredCard === industry.id
                            ? "var(--primary)"
                            : "var(--text-secondary)",
                      }}
                    />
                  </div>
                  <h3
                    className="text-base font-medium text-center"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {industry.title}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Industry Input - shown when Other is selected */}
        {selectedIndustry === "other" && (
          <div className="max-w-2xl mx-auto mb-6 flex gap-3 items-center">
            <input
              type="text"
              value={customIndustry}
              onChange={(e) => onCustomIndustryChange(e.target.value)}
              placeholder="e.g., Agriculture, Energy, Construction..."
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
                if (e.key === "Enter" && customIndustry.trim()) {
                  onCustomIndustryContinue();
                }
              }}
            />
            <button
              onClick={onCustomIndustryContinue}
              disabled={!customIndustry.trim()}
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
  );
};

export default IndustrySelection;
