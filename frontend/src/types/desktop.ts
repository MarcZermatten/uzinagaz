export interface DesktopIcon {
  id: string;
  type: 'game' | 'folder' | 'settings' | 'achievements' | 'recycle' | 'custom';
  label: string;
  icon_url?: string;
  position: { x: number; y: number };
  data?: any;
}

export interface WindowData {
  id: string;
  type: 'folder' | 'settings' | 'achievements' | 'profile' | 'custom';
  title: string;
  content?: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
}

export type WindowType = WindowData['type'];
