declare class ClientAPI {
  constructor();
  public canRequestInvite(): Promise<boolean>;
  public initSession(): Promise<{
    alias: string;
    rid: string;
    invite: string;
    authed: boolean;
  }>;
}

declare module 'client-api' {
  export = ClientAPI;
}