import { useDesktopStore } from '../../stores/desktopStore';
import './CRTScanlines.css';

export const CRTScanlines = () => {
  const scanlineIntensity = useDesktopStore((state) => state.scanlineIntensity);

  return (
    <div
      className="crt-scanlines"
      style={{
        opacity: scanlineIntensity,
      }}
    />
  );
};
