

export function useHorizontalScrollbar(className: string, scrollAmount: number) {

  function scrollBy(deltaY: number) {
    return deltaY < 0 ? -scrollAmount : scrollAmount;
  }

  function scroll(e: WheelEvent, el?: HTMLElement): void {
    const target = el || e.target as HTMLElement;
    if (!target.classList.contains(className))
      return scroll(e, target.parentElement!)
    ;
    target.scrollTo(target.scrollLeft + scrollBy(e.deltaY), 0);
  }

  return {
    isScrolling: false,
    scroll(e: WheelEvent, timeout: number) {
      if (this.isScrolling) return;
      this.isScrolling = true;
      scroll(e);
      setTimeout(() => this.isScrolling = false, timeout);
    }
  };
}


