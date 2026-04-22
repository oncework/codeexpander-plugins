export function showToast(message: string): void {
  (window as any).__codeexpander?.showToast?.(message);
}

export function showErrorToast(title: string, description?: string): void {
  showToast(description ? `${title}: ${description}` : title);
}

export async function copyWithToast(text: string, message: string = "Copied!"): Promise<void> {
  const write = (window as any).__codeexpander?.writeClipboard;
  if (typeof write === "function") {
    write(text);
  } else {
    await navigator.clipboard.writeText(text);
  }
  showToast(message);
}
