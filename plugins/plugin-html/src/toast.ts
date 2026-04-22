export function showToast(message: string): void {
  window.__codeexpander?.showToast?.(message);
}

export function showErrorToast(title: string, description?: string): void {
  showToast(description ? `${title}: ${description}` : title);
}
