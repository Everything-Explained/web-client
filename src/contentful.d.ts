declare namespace contentful {

  interface Entry {
    fields: {
      title: string;
      body: string;
      date: string;
    }
    sys: {
      createdAt: string;
      updatedAt: string;
    }
  }

  interface Entries {
    items: Entry[]
  }

  interface Client {
    getEntry: (entry: string) => Promise<Entry>;
    getEntries: (options?: any) => Promise<Entries>;
  }

  export function createClient(options: { accessToken: string; space: string}): Client;



}