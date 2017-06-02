interface Window {
  session: {
    authed: boolean;
    secret: string;
    alias: string;
    email: string;
  };
  loggedin: boolean;
}