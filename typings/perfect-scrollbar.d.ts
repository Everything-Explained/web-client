
interface IPSBOptions {

  wheelSpeed?: number;
  wheelPropagation?: boolean;
  useBothWheelAxes?: boolean;
  useKeyboard?: boolean;
  minScrollbarLength?: number;
  maxScrollbarLength?: number;
  swipePropagation?: boolean;
  stopPropagationOnClick?: boolean;

  suppressScrollX?: boolean;
  suppressScrollY?: boolean;

  scrollXMarginOffset?: number;
  scrollYMarginOffset?: number;
}


interface IPSB {

  initialize(container: HTMLElement|Element|Node, options?: IPSBOptions): void;

  destroy(container: HTMLElement|Element|Node);

  update(container: HTMLElement|Element|Node);
}

declare var Ps: IPSB;