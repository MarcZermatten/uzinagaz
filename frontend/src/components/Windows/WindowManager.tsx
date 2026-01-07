import { useWindowStore } from '../../stores/windowStore';
import { Window } from './Window';
import { SettingsWindow } from './SettingsWindow';
import { AchievementsWindow } from './AchievementsWindow';
import { FolderWindow } from './FolderWindow';

export const WindowManager = () => {
  const windows = useWindowStore((state) => state.windows);

  const getWindowContent = (window: any) => {
    switch (window.type) {
      case 'settings':
        return <SettingsWindow />;
      case 'achievements':
        return <AchievementsWindow />;
      case 'folder':
        return <FolderWindow consoleId={window.data as string} />;
      case 'profile':
        return (
          <div>
            <h3>User Profile</h3>
            <p>Profile details will appear here</p>
          </div>
        );
      default:
        return <div>Unknown window type</div>;
    }
  };

  return (
    <>
      {windows.map((window) => (
        <Window key={window.id} window={window}>
          {getWindowContent(window)}
        </Window>
      ))}
    </>
  );
};
