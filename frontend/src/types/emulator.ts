export interface EmulatorConfig {
  core: string;
  romUrl: string;
  biosUrl?: string;
  dataPath: string;
}

export interface GameControls {
  up: string;
  down: string;
  left: string;
  right: string;
  a: string;
  b: string;
  start: string;
  select: string;
}
