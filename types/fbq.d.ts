export {};

declare global {
  interface Window {
    fbq?: FacebookPixel;
    _fbq?: FacebookPixel;
  }

  interface FacebookPixel {
    (...args: unknown[]): void;
    callMethod?: (...args: unknown[]) => void;
    queue: unknown[][];
    push: FacebookPixel;
    loaded: boolean;
    version: string;
  }
}
