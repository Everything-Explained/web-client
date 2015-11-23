

export class Bean {

  on(element: any, eventType: string, handler: () => void, ...handlerArgs: string[]);
  on(element: any, eventType: string, selector: string, handler: () => void, ...handlerArgs: string[]);

  fire(element: any, eventType: string);
}
