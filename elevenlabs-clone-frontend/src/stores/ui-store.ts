import { create } from "zustand";

type TabType = "settings" | "history";

interface UIState {
  isMobileDrawerOpen: boolean;
  isMobileScreen: boolean;
  activeTab: TabType;
  isMobileMenuOpen: boolean;
  toggleMobileDrawer: () => void;
  setMobileScreen: (isMobile: boolean) => void;
  setActiveTab: (tab: TabType) => void;
  toggleMobileMenu: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileDrawerOpen: false,
  isMobileScreen: true,
  isMobileMenuOpen: true,
  activeTab: "settings",
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileDrawerOpen })),
  toggleMobileDrawer: () =>
    set((state) => ({ isMobileDrawerOpen: !state.isMobileDrawerOpen })),
  setMobileScreen: (isMobile) => set(() => ({ isMobileScreen: isMobile })),
  setActiveTab: (tab) => set(() => ({ activeTab: tab })),
}));
