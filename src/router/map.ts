import { isDevelopment, isProduction } from "../globals";

type Route = {
  path: { name: string }
  title: string;
  visible: boolean;
}

const mapRoute = (name: string, title: string, visible?: boolean) => (
  { path: { name }, title, visible: visible ?? true } as Route
);

const routeMap = [
  { name: 'root', routes: [
    mapRoute('home', 'Home'),
    mapRoute('blog', 'Blog'),
  ]},
  { name: 'Library', routes: [
    mapRoute('lib-videos', 'Videos'),
    mapRoute('lib-lit', 'Literature', isDevelopment),
  ]},
  { name: 'RED33M', routes: [
    mapRoute('r3d-videos', 'Videos')
  ]},
  { name: 'Accessory', hidden: isProduction, routes: [
    mapRoute('red33m-auth', 'R3D Auth', isDevelopment),
    mapRoute('red33m-form', 'R3D Form', isDevelopment)
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