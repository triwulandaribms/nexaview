import React from "react";
import { ArrowLeft } from "lucide-react";

const BusinessUseCaseSelection = ({
  useCases,
  selectedUseCase,
  customUseCase,
  hoveredCard,
  onUseCaseSelect,
  onCustomUseCaseChange,
  onCustomUseCaseContinue,
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
            Use case
          </h1>
          <div className="text-base" style={{ color: "var(--text-secondary)" }}>
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
                onClick={() => onUseCaseSelect(useCase.id)}
                className="p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor:
                    selectedUseCase === useCase.id
                      ? "var(--primary)"
                      : hoveredCard === useCase.id
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
                        selectedUseCase === useCase.id ||
                        hoveredCard === useCase.id
                          ? "var(--primary-light)"
                          : "var(--surface-secondary)",
                    }}
                  >
                    <Icon
                      className="w-6 h-6 transition-all duration-300"
                      style={{
                        color:
                          selectedUseCase === useCase.id ||
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
        </div>

        {/* Custom Use Case Input - shown when Other is selected */}
        {selectedUseCase === "other" && (
          <div className="max-w-2xl mx-auto mb-6 flex gap-3 items-center">
            <input
              type="text"
              value={customUseCase}
              onChange={(e) => onCustomUseCaseChange(e.target.value)}
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
                  onCustomUseCaseContinue();
                }
              }}
            />
            <button
              onClick={onCustomUseCaseContinue}
              disabled={!customUseCase.trim()}
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

export default BusinessUseCaseSelection;
