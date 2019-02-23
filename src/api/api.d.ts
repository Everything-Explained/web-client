
declare class ClientAPI {
  constructor();
  public canRequestInvite(): Promise<boolean>;
}

declare module 'client-api' {
  export = ClientAPI;
}