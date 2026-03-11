/**
 * CodeExpander plugin host bridge types.
 * Single source of truth for Window augmentations used by all plugins.
 */
declare global {
  interface Window {
    __codeexpander_initial_payload?: { keyword?: string; locale?: string };
    __codeexpander?: {
      writeClipboard?: (text: string) => void | Promise<void>;
      showToast?: (message: string) => void;
    };
  }
}

export {};
