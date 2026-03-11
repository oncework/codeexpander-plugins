export function showToast(message: string): void {
  (window as any).__codeexpander?.showToast?.(message);
}

export function showErrorToast(title: string, description?: string): void {
  showToast(description ? `${title}: ${description}` : title);
}

export async function copyToClipboard(text: string): Promise<void> {
  const w = window as any;
  if (typeof w?.__codeexpander?.writeClipboard === "function") {
    w.__codeexpander.writeClipboard(text);
  } else {
    await navigator.clipboard.writeText(text);
  }
  showToast("Copied!");
}
