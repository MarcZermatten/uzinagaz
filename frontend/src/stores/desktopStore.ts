import { create } from 'zustand';
import type { DesktopIcon } from '../types';

interface DesktopState {
  icons: DesktopIcon[];
  wallpaper: string;
  bootComplete: boolean;
  crtEnabled: boolean;
  scanlineIntensity: number;
  setIcons: (icons: DesktopIcon[]) => void;
  addIcon: (icon: DesktopIcon) => void;
  removeIcon: (id: string) => void;
  updateIconPosition: (id: string, x: number, y: number) => void;
  setBootComplete: (complete: boolean) => void;
  toggleCRT: () => void;
  setScanlineIntensity: (intensity: number) => void;
}

export const useDesktopStore = create<DesktopState>((set) => ({
  icons: [
    // Console folders
    {
      id: 'folder-nes',
      type: 'folder',
      label: 'NES',
      position: { x: 20, y: 20 },
      data: 'nes',
    },
    {
      id: 'folder-snes',
      type: 'folder',
      label: 'SNES',
      position: { x: 20, y: 120 },
      data: 'snes',
    },
    {
      id: 'folder-gb',
      type: 'folder',
      label: 'Game Boy',
      position: { x: 20, y: 220 },
      data: 'gb',
    },
    {
      id: 'folder-gbc',
      type: 'folder',
      label: 'GB Color',
      position: { x: 20, y: 320 },
      data: 'gbc',
    },
    {
      id: 'folder-gba',
      type: 'folder',
      label: 'GBA',
      position: { x: 20, y: 420 },
      data: 'gba',
    },
    {
      id: 'folder-megadrive',
      type: 'folder',
      label: 'Mega Drive',
      position: { x: 140, y: 20 },
      data: 'megadrive',
    },
    {
      id: 'folder-n64',
      type: 'folder',
      label: 'Nintendo 64',
      position: { x: 140, y: 120 },
      data: 'n64',
    },
    {
      id: 'folder-psx',
      type: 'folder',
      label: 'PlayStation',
      position: { x: 140, y: 220 },
      data: 'psx',
    },
    {
      id: 'folder-dreamcast',
      type: 'folder',
      label: 'Dreamcast',
      position: { x: 140, y: 320 },
      data: 'dreamcast',
    },
    {
      id: 'folder-ps2',
      type: 'folder',
      label: 'PlayStation 2',
      position: { x: 140, y: 420 },
      data: 'ps2',
    },
    // System icons
    {
      id: 'settings',
      type: 'settings',
      label: 'Settings',
      position: { x: 260, y: 20 },
    },
    {
      id: 'achievements',
      type: 'achievements',
      label: 'Achievements',
      position: { x: 260, y: 120 },
    },
    {
      id: 'recycle',
      type: 'recycle',
      label: 'Recycle Bin',
      position: { x: 260, y: 220 },
    },
  ],
  wallpaper: '/assets/wallpaper-xp-bliss.svg',
  bootComplete: false,
  crtEnabled: true,
  scanlineIntensity: 0.5,
  setIcons: (icons) => set({ icons }),
  addIcon: (icon) => set((state) => ({ icons: [...state.icons, icon] })),
  removeIcon: (id) =>
    set((state) => ({ icons: state.icons.filter((i) => i.id !== id) })),
  updateIconPosition: (id, x, y) =>
    set((state) => ({
      icons: state.icons.map((icon) =>
        icon.id === id ? { ...icon, position: { x, y } } : icon
      ),
    })),
  setBootComplete: (complete) => set({ bootComplete: complete }),
  toggleCRT: () => set((state) => ({ crtEnabled: !state.crtEnabled })),
  setScanlineIntensity: (intensity) => set({ scanlineIntensity: intensity }),
}));
