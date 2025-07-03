"use client";
import React, { useState } from "react";
import FeedbackModal from "./FeedbackModal";
import UpgradeModal from "./UpgradeModal";
import Link from "next/link";
import { Wallet, HelpCircle, PanelLeft, Menu } from "lucide-react";

const Header = ({ toggleSidebar }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Nexa Studio");

  return (
    <>
      <header
        className="h-16 flex items-center px-4 sm:px-6 sticky top-0 z-50 glass border-b"
        style={{
          background: "var(--header-bg)",
          borderColor: "var(--header-border)",
          backdropFilter: "blur(20px)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Logo/Brand */}
        <div className="flex items-center space-x-4 lg:space-x-8">
          <h1
            className="text-lg sm:text-xl font-bold"
            style={{
              background: "var(--sidebar-active-bg)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            NextDocs
          </h1>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6 items-center">
            <div className="flex items-center gap-2">
              <Link
                href="/experience-center"
                onClick={() => setActiveTab("Experience Center")}
                className={`text-sm transition-all duration-200 ${
                  activeTab === "Experience Center"
                    ? "text-(--primary) font-bold"
                    : "text-(--text-muted)"
                }`}
              >
                Experience Center
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setActiveTab("Nexa Studio")}
                className={`text-sm transition-all duration-200 ${
                  activeTab === "Nexa Studio"
                    ? "text-(--primary) font-bold"
                    : "text-(--text-muted)"
                }`}
              >
                Nexa Studio
              </Link>
            </div>
            <button
              className="text-sm font-semibold px-4 py-2 rounded-md transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              style={{
                background: "var(--sidebar-active-bg)",
                color: "var(--text-inverse)",
              }}
            >
              Studio
            </button>
          </nav>
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center space-x-2 sm:space-x-4 ">
          {/* User info */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="hidden sm:flex items-center space-x-2">
              <button
                onClick={() => setIsFeedbackModalOpen(true)}
                className="text-xs sm:text-sm font-medium transition-colors duration-200 hover:opacity-80 cursor-pointer"
                style={{ color: "var(--text-secondary)" }}
              >
                Feedback
              </button>
              <button
                className="text-xs font-bold px-2 sm:px-3 py-2 rounded-md flex items-center gap-2 transition-all duration-200 hover:scale-105"
                style={{
                  background: "var(--surface-tertiary)",
                  color: "var(--text-primary)",
                }}
              >
                <Wallet className="size-4" />
                <div className="">1.8K</div>
              </button>
            </div>

            <button
              className="p-2 rounded-md transition-all duration-200 hover:scale-110 cursor-pointer"
              style={{
                background: "var(--surface-secondary)",
                color: "var(--text-secondary)",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "var(--surface-tertiary)";
                e.target.style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "var(--surface-secondary)";
                e.target.style.color = "var(--text-secondary)";
              }}
            >
              <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="px-3 sm:px-6 py-2 rounded-md text-xs sm:text-sm font-bold transition-all duration-200 transform hover:scale-105 hover:shadow-xl cursor-pointer"
              style={{
                background: "var(--sidebar-active-bg)",
                color: "var(--text-inverse)",
              }}
            >
              Upgrade
            </button>

            {/* Mobile sidebar toggle button */}
            <button
              className="lg:hidden p-2 rounded-md transition-all duration-200 hover:scale-110"
              style={{
                background: "var(--surface-secondary)",
                color: "var(--text-secondary)",
              }}
              onClick={toggleSidebar}
              onMouseEnter={(e) => {
                e.target.style.background = "var(--surface-tertiary)";
                e.target.style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "var(--surface-secondary)";
                e.target.style.color = "var(--text-secondary)";
              }}
            >
              <PanelLeft className="h-5 w-5" />
            </button>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-md transition-all duration-200 hover:scale-110"
              style={{
                background: "var(--surface-secondary)",
                color: "var(--text-secondary)",
              }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              onMouseEnter={(e) => {
                e.target.style.background = "var(--surface-tertiary)";
                e.target.style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "var(--surface-secondary)";
                e.target.style.color = "var(--text-secondary)";
              }}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden border-b"
          style={{
            background: "var(--surface-elevated)",
            borderColor: "var(--border-light)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div className="px-4 py-3 space-y-3">
            {/* Mobile Navigation */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Link
                  href="/experience-center"
                  onClick={() => setActiveTab("Experience Center")}
                  className={`text-sm transition-all duration-200 flex-1 text-center py-2 ${
                    activeTab === "Experience Center"
                      ? "text-(--primary) font-bold"
                      : "text-(--text-muted)"
                  }`}
                >
                  Experience Center
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setActiveTab("Nexa Studio")}
                  className={`text-sm transition-all duration-200 flex-1 text-center py-2 ${
                    activeTab === "Nexa Studio"
                      ? "text-(--primary) font-bold"
                      : "text-(--text-muted)"
                  }`}
                >
                  Nexa Studio
                </Link>
              </div>
              <button
                className="w-full text-left p-3 rounded-md font-semibold transition-colors"
                style={{
                  background: "var(--primary-light)",
                  color: "var(--primary)",
                }}
              >
                Studio
              </button>
            </div>

            {/* Mobile Feedback (visible on mobile) */}
            <button
              onClick={() => setIsFeedbackModalOpen(true)}
              className="sm:hidden flex items-center justify-between p-3 rounded-md w-full transition-all duration-200 hover:scale-105"
              style={{ background: "var(--surface-hover)" }}
            >
              <span
                className="text-sm font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Feedback
              </span>
              <span
                className="text-xs font-bold px-3 py-1 rounded-md flex items-center gap-2"
                style={{
                  background: "var(--surface-tertiary)",
                  color: "var(--text-primary)",
                }}
              >
                <Wallet className="size-3" />
                1.8K
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </>
  );
};

export default Header;
