declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<unknown, unknown, any>;
  export default component;
}

declare const process: {
  env: {
    /** Vite-injected environment variable */
    NODE_ENV: string
  }
};
