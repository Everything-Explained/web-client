

interface IOptiscrollOptions {

  /**
   * Prevents scrolling parent container (or body) when scroll reach top or bottom.
   * Works also on iOS preventing the page bounce.
   */
  preventParentScroll?: boolean;


  /** Use custom scrollbars also on iOS, Android and OSX (w/ trackpad) */
  forceScrollbars?: boolean;


  /** Time before presuming that the scroll is ended, then fire "scrollstop" event */
  scrollStopDelay?: boolean;


  /** Maximum size (width or height) of the track */
  maxTrackSize?: number;


  /** Minimum size (width or height) of the track */
  minTrackSize?: number;


  /** Allow track dragging to scroll */
  draggableTracks?: boolean;


  /** Scrollbars will be automatically updated on size or content changes */
  autoUpdate?: boolean;


  /** Custom class prefix for optiscroll elements */
  classPrefix?: string;
}


interface IOptiscrollInstance {


  /** Scroll to a specific point with a nice animation
   *
   * @param destX A pixel position or string direction along the X axis.
   * @param destY A pixel position or string direction along the Y axis.
   * @param duration An optional duration in milliseconds or "auto"
   */
  scrollTo(destX: number|string|boolean, destY: number|string|boolean, duration?: number|string): void;


  /**
   * Scrolls the element into view.
   * The alignment will be driven by the nearest edge.
   *
   * @param element The element to scroll to
   * @param duration The time in milliseconds it takes to scroll or "auto"
   * @param delta The optional distance in pixels from the edge
   *              in an object: { top, left, bottom, right }
   */
  scrollIntoView(element: HTMLElement|Element|string, duration?: number|string, delta?: { top?: number, left?: number, right?: number, bottom?: number }): void;


  /**
   * Forces the scrollbar to recalculate its content.
   * Usually only necessary if you have autoUpdate set to false.
   */
  update(): void;


  /**
   * Cleans up the scrollbar instance/events and removes all
   * scrollbar elements.
   */
  destroy(): void;


}

interface IOptiscrollEvent extends Event {
  type: string;
  detail: {
    scrollbarH: {
      percent: number;
      position: number;
      size: number;
      enabled: boolean;
    };
    scrollbarV: {
      percent: number;
      position: number;
      size: number;
      enabled: boolean;
    }
    scrollTop: number;
    scrollLeft: number;
    scrollBottom: number;
    scrollRight: number;
    scrollHeight: number;
    scrollWidth: number;
    clientHeight: number;
    clientWidth: number;
  }
}



interface HTMLElement {
  addEventListener(type: "scroll", listener: (ev: IOptiscrollEvent) => any, useCapture?: boolean): void;
  addEventListener(type: "sizechange", listener: (ev: IOptiscrollEvent) => any, useCapture?: boolean): void;
  addEventListener(type: "scrollstart", listener: (ev: IOptiscrollEvent) => any, useCapture?: boolean): void;
  addEventListener(type: "scrollstop", listener: (ev: IOptiscrollEvent) => any, useCapture?: boolean): void;
  addEventListener(type: "scrollreachedge", listener: (ev: IOptiscrollEvent) => any, useCapture?: boolean): void;
  addEventListener(type: "scrollreachtop", listener: (ev: IOptiscrollEvent) => any, useCapture?: boolean): void;
  addEventListener(type: "scrollreachbottom", listener: (ev: IOptiscrollEvent) => any, useCapture?: boolean): void;
  addEventListener(type: "scrollreachleft", listener: (ev: IOptiscrollEvent) => any, useCapture?: boolean): void;
  addEventListener(type: "scrollreachright", listener: (ev: IOptiscrollEvent) => any, useCapture?: boolean): void;
}


interface IOptiscroll {

  /**
   * Creates a new intance of the Optiscroll scrollbar
   *
   * @param element The element to set as the container for the scrollbar
   * @param options The IOptiscrollOptions to initialize the scrollbar with.
   */
  new (element: Node|HTMLElement|Element, options?: IOptiscrollOptions): IOptiscrollInstance;

  /**
   * How often scroll areas are checked for size or content changes.
   * To disable the check timer (and the scrollbars auto update feature)
   * set this value to 0.
   */
   checkFrequency: number;


  /** Global settings object. */
  globalSettings: {

    /**
     * How often scroll areas are checked for size or content changes.
     * To disable the check timer (and the scrollbars auto update feature)
     * set this value to 0.
     */
    checkFrequency: number;


    /**
     * By default the scrollbars position is updated up to 40 times per second.
     * By increasing this time the scroll tracks will be updated less frequently.
     * The smallest interval is 16, which means scroll tracks are updated up
     * to 60 times per second.
     */
    scrollMinUpdateInterval: number;



  }

}


declare var Optiscroll: IOptiscroll;