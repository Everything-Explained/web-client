import { RouteLocationNormalizedLoaded } from "vue-router";

export type ISODateString = string;

export type Route = RouteLocationNormalizedLoaded;

declare global {
  interface Window {
    app: any;
  }
}

export interface Video {
  id      : string;
  title   : string;
  author  : string;
  content : string;
  date    : ISODateString;
}