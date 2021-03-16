import { isDevelopment, isProduction } from "../globals";

type Route = {
  path: string
  title: string;
  visible: boolean;
}

const mapRoute = (path: string, title: string, visible?: boolean) => (
  { path, title, visible: visible ?? true } as Route
);

const routeMap = [
  { name: 'root', routes: [
    mapRoute('/home', 'Home'),
    mapRoute('/blog', 'Blog'),
  ]},
  { name: 'Library', routes: [
    mapRoute('/library/videos', 'Videos'),
    mapRoute('/library/literature', 'Literature'),
  ]},
  { name: 'RED33M', routes: [
    mapRoute('/red33m/videos', 'Videos'),
    mapRoute('/red33m/literature', 'Literature'),
  ]},
  { name: 'Utility', routes: [
    mapRoute('/changelog', 'ChangeLog')
  ]},
  { name: 'Accessory', hidden: isProduction, routes: [
    mapRoute('/red33m/auth', 'R3D Auth', isDevelopment),
    mapRoute('/red33m/form', 'R3D Form', isDevelopment)
  ]},
];

type RouteMap = typeof routeMap;

function normalizeRoutes(map: RouteMap) {
  // Not a performant clone
  const newMap = JSON.parse(JSON.stringify(map)) as RouteMap;
  let mapName: keyof RouteMap;
  for (mapName in newMap) {
    newMap[mapName].routes =
      newMap[mapName].routes.filter(route => route.visible)
    ;
  }
  return newMap;
}


export function useRouteMap() {
  return normalizeRoutes(routeMap);
}