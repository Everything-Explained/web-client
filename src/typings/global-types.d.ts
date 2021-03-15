import { RouteLocationNormalizedLoaded } from "vue-router";

export type Route = RouteLocationNormalizedLoaded;

declare global {
  interface Window {
    app: any;
  }
}