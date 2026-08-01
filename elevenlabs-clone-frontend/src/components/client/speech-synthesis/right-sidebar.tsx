"use client";

import { useUIStore } from "~/stores/ui-store";
import type { ServiceType } from "~/types/services";
import { VoiceSelector } from "../voice-selector";
import { HistoryPanel } from "./history-panel";
import { useState } from "react";
import type { HistoryItem } from "~/lib/history";

export function SpeechSidebar({
  service,
  historyItems,
}: {
  service: ServiceType;
  historyItems?: HistoryItem[];
}) {
  const {
    activeTab,
    setActiveTab,
    isMobileMenuOpen,
    toggleMobileMenu,
    isMobileScreen,
  } = useUIStore();

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <div className="md hidden h-full w-[350px] flex-col border-l bg-white p-5 md:flex lg:w-[500px]">
        <div className="relative mb-6 flex">
          <div className="absolute right-0 bottom-0 left-0 border-b border-gray-200"></div>
          <button
            className={`relative z-10 mr-4 pb-2 text-sm transition-colors duration-200 ${activeTab === "settings" ? "border-b-2 border-black text-black" : "text-gray-700 hover:text-gray-700"}`}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </button>
          <button
            className={`relative z-10 mr-4 pb-2 text-sm transition-colors duration-200 ${activeTab === "history" ? "border-b-2 border-black text-black" : "text-gray-700 hover:text-gray-700"}`}
            onClick={() => setActiveTab("history")}
          >
            History
          </button>
        </div>
        <div className="transition-opacity duration-200">
          {activeTab === "settings" ? (
            <div className="mb-6">
              <h2 className="mb-2 text-sm">Voice</h2>
              <VoiceSelector service={service} />
            </div>
          ) : (
            <HistoryPanel
              service={service}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              hoveredItem={hoveredItem}
              setHoveredItem={setHoveredItem}
              historyItems={historyItems}
            />
          )}
        </div>
      </div>
    </>
  );
}
