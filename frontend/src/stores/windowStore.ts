import { create } from 'zustand';
import type { WindowData, WindowType } from '../types';

interface WindowState {
  windows: WindowData[];
  activeWindowId: string | null;
  openWindow: (type: WindowType, title: string, content?: any) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
}

let windowIdCounter = 0;

export const useWindowStore = create<WindowState>((set, get) => ({
  windows: [],
  activeWindowId: null,

  openWindow: (type, title, content) => {
    const id = `window-${++windowIdCounter}`;
    const maxZIndex = Math.max(...get().windows.map(w => w.zIndex), 0);

    const newWindow: WindowData = {
      id,
      type,
      title,
      content,
      position: { x: 100 + (windowIdCounter * 20), y: 100 + (windowIdCounter * 20) },
      size: { width: 600, height: 400 },
      zIndex: maxZIndex + 1,
      minimized: false,
      maximized: false,
    };

    set((state) => ({
      windows: [...state.windows, newWindow],
      activeWindowId: id,
    }));
  },

  closeWindow: (id) =>
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    })),

  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, minimized: true } : w
      ),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    })),

  maximizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, maximized: !w.maximized } : w
      ),
    })),

  bringToFront: (id) => {
    const maxZIndex = Math.max(...get().windows.map(w => w.zIndex), 0);
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, zIndex: maxZIndex + 1, minimized: false } : w
      ),
      activeWindowId: id,
    }));
  },

  updateWindowPosition: (id, x, y) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, position: { x, y } } : w
      ),
    })),

  updateWindowSize: (id, width, height) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, size: { width, height } } : w
      ),
    })),
}));
