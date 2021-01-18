

export function usePreventBubble() {
  return function preventBubble(e: MouseEvent|KeyboardEvent|WheelEvent) {
    e.preventDefault();
    e.stopImmediatePropagation();
  };
}