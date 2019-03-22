declare class ClientAPI {
  constructor();
  public canRequestInvite(): Promise<boolean>;
  public initSession(): Promise<void>;
}

declare module 'client-api' {
  export = ClientAPI;
}