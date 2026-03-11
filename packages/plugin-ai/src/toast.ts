export function showToast(message: string): void {
  window.__codeexpander?.showToast?.(message);
}

export function showErrorToast(title: string, description?: string): void {
  showToast(description ? `${title}: ${description}` : title);
}

export async function copyToClipboard(text: string): Promise<void> {
  if (typeof (window as any).__codeexpander?.writeClipboard === "function") {
    await (window as any).__codeexpander.writeClipboard(text);
  } else {
    await navigator.clipboard.writeText(text);
  }
  showToast("Copied!");
}
