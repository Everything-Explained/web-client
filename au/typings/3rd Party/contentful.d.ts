

declare namespace contentful {

  interface Entry {
    fields: {
      title?: string;
      body?: string;
      date?: string;
    }
  }

  interface Client {
    getEntry: (entry: string) => Promise<Entry>;
  }

  export function createClient(options: { accessToken: string; space: string}): Client;



}