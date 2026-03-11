export function showToast(message: string): void {
  window.__codeexpander?.showToast?.(message);
}
