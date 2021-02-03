import { isDevelopment } from "../globals";

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
    mapRoute('red33m', 'RED33M', isDevelopment),
  ]},
  { name: 'Library', routes: [
    mapRoute('videos', 'Videos'),
    mapRoute('literature', 'Literature', isDevelopment),
  ]},
  { name: 'Accessory', routes: [
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