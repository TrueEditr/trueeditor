export interface TrueEditrConfig {
  placeholder?: string;
  watermark?: boolean;
  apiUrl?: string;
}

export interface TrueEditrOptions {
  key?: string;
  selector: string;
  config?: TrueEditrConfig;
}

declare class TrueEditr {
  constructor(options: TrueEditrOptions);
  
  // Add methods based on your implementation
  getContent(): string;
  setContent(html: string): void;
  destroy(): void;
}

export default TrueEditr;