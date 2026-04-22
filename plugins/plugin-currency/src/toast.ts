export function showToast(message: string): void {
  window.__codeexpander?.showToast?.(message);
}

export function showErrorToast(title: string, description?: string): void {
  showToast(description ? `${title}: ${description}` : title);
}

export async function copyToClipboard(text: string, message: string = "Copied!"): Promise<void> {
  const w = window as Window & { __codeexpander?: { writeClipboard?: (text: string) => void } };
  if (typeof w.__codeexpander?.writeClipboard === "function") {
    w.__codeexpander!.writeClipboard!(text);
  } else {
    await navigator.clipboard.writeText(text);
  }
  showToast(message);
}
