export function showToast(message: string): void {
  window.__codeexpander?.showToast?.(message);
}

export function showErrorToast(title: string, description?: string): void {
  showToast(description ? `${title}: ${description}` : title);
}

/** Copy text via host clipboard API then show message (default "Copied!") */
export function copyWithToast(text: string, message: string = "Copied!"): void {
  (window as any).__codeexpander?.writeClipboard?.(text);
  showToast(message);
}
