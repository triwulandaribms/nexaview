"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import {
  Home,
  MessageCircle,
  Settings,
  Link as LinkIcon,
  Wrench,
  Bot,
  GitBranch,
  Box,
  Network,
  Database,
  BookOpen,
  Search,
  LogOut,
  User,
  Gamepad2,
  Users,
  Shield,
  Key
} from "lucide-react";
import { usePathname } from "next/navigation";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeItem, setActiveItem] = useState("/dashboard");
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      console.log("Logout clicked");
      const res = await fetch('/api/auth/logout', {
        method: 'POST'
      });

      if (res.ok) {
        router.push('/login');
      } else {
        const errorData = await res.json();
        console.error('Logout gagal:', errorData);
      }
    } catch (error) {
      console.error('Error saat logout:', error);
    }

    if (isMobile) setIsOpen(false);
  };

  useEffect(() => {
    if (pathname !== activeItem) {
      setActiveItem("/" + pathname.split("/")[1]);
    }
  }, [pathname]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsOpen(false); // Close mobile menu when switching to desktop
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Navigation items arrays with hrefs
  const mainNavItems = [
    { icon: Home, label: "Home", href: "/dashboard" },
    // { icon: Gamepad2, label: 'Playground', href: '/playground' },
    { icon: MessageCircle, label: "Interact", href: "/interact" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: LinkIcon, label: "Integration", href: "/integration" },
  ];

  const applicationItems = [
    { icon: Wrench, label: "Tools", href: "/tools" },
    { icon: Bot, label: "Agents", href: "/agents" },
    { icon: GitBranch, label: "AI chain", href: "/ai-chain" },
  ];

  const foundationDataItems = [
    { icon: Box, label: "Models", href: "/models" },
    { icon: Network, label: "Connections", href: "/connections" },
    { icon: Database, label: "Dataset", href: "/dataset" },
    { icon: BookOpen, label: "Knowledge base", href: "/knowledge-base" },
  ];

  const managementItems = [
    { icon: Users, label: "User Management", href: "/user-management" },
    { icon: Shield , label: "Role Management", href: "/role-management" },
  ];


  const observeTestItems = [
    { icon: Search, label: "Tracing", href: "/tracing" },
  ];

  const NavItem = ({ icon: Icon, label, href, isActive = false, onClick }) => (
    <Link href={href} className="block">
      <div
        className={`flex items-center space-x-3 p-[10px] rounded-md cursor-pointer transition-all duration-200 ${isActive ? "shadow-sm" : ""
          }`}
        style={{
          background: isActive ? "var(--sidebar-active-light)" : "transparent",
          color: isActive ? "var(--primary)" : "var(--sidebar-text)",
          ...(isActive && { boxShadow: "var(--shadow-sm)" }),
        }}
        onClick={() => {
          setActiveItem(href);
          if (isMobile) setIsOpen(false); // Close mobile sidebar on item click
          if (onClick) onClick();
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = "var(--sidebar-hover-bg)";
            e.currentTarget.style.color = "var(--sidebar-text-hover)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--sidebar-text)";
          }
        }}
      >
        <Icon className="h-4 sm:w-4 flex-shrink-0" />
        <span
          className={`text-xs sm:text-sm ${isActive ? "font-semibold" : "font-medium"
            }`}
        >
          {label}
        </span>
        {isActive && (
          <div
            className="ml-auto w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0"
            style={{ background: "var(--primary)" }}
          ></div>
        )}
      </div>
    </Link>
  );

  const SectionHeader = ({ title }) => (
    <div className="px-2 sm:px-3 py-2 mt-4 mb-2">
      <h3
        className="text-xs font-bold uppercase tracking-wider"
        style={{ color: "var(--text-muted)" }}
      >
        {title}
      </h3>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] border-r flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${isMobile
          ? isOpen
            ? "translate-x-0"
            : "-translate-x-full"
          : "translate-x-0"
          }`}
        style={{
          background: "var(--sidebar-bg)",
          borderColor: "var(--sidebar-border)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* User Profile Section */}
        <div
          className="p-4 sm:p-6 border-b flex-shrink-0"
          style={{ borderColor: "var(--sidebar-border)" }}
        >
          <div className="flex items-center space-x-3">
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
              style={{
                background: "var(--sidebar-active-bg)",
                color: "var(--text-inverse)",
              }}
            >
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="font-semibold text-xs sm:text-sm truncate"
                style={{ color: "var(--sidebar-text-hover)" }}
              >
                Dika Irwandifika
              </p>
              <p className="text-xs" style={{ color: "var(--sidebar-text)" }}>
                Premium User
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-3 sm:p-4 space-y- flex-1 overflow-y-auto">
          {/* Main Navigation */}
          {mainNavItems.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={activeItem === item.href}
            />
          ))}

          {/* Applications Section */}
          <SectionHeader title="APPLICATIONS" />
          {applicationItems.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={activeItem === item.href}
            />
          ))}

          {/* Foundation & Data Section */}
          <SectionHeader title="FOUNDATION & DATA" />
          {foundationDataItems.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={activeItem === item.href}
            />
          ))}

          {/* MANAGEMENT */}
          <SectionHeader title="MANAGEMENT" />
          {managementItems.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={activeItem === item.href}
            />
          ))}
          {/* Observe & Test Section */}
          <SectionHeader title="OBSERVE & TEST" />
          {observeTestItems.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={activeItem === item.href}
            />
          ))}
        </div>

        {/* Bottom section - Logout */}
        <div className="p-3 sm:p-4 flex-shrink-0">
          <button
            className="w-full p-3 sm:p-4 rounded-md border transition-all duration-200 cursor-pointer hover:scale-105"
            style={{
              background: "var(--sidebar-active-bg)",
              borderColor: "var(--border-light)",
              color: "var(--text-inverse)",
            }}
            onClick={handleLogout}

          >
            <div className="flex items-center space-x-3">
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">Logout</span>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
