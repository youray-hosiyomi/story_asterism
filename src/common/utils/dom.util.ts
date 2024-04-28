export function activeHtmlElement(): HTMLElement | null {
  return document.activeElement as HTMLElement | null;
}

export function htmlElementFocusById(id: string) {
  const elm = document.getElementById(id);
  htmlElementFocus(elm);
}

export function htmlElementFocus(elm: HTMLElement | null) {
  elm?.focus();
}
