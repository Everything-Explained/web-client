import { isDevelopment } from "../globals";

type Route = {
  path: { name: string }
  title: string;
  visible: boolean;
}

const mapRoute = (name: string, title: string, visible?: boolean) => (
  { path: { name }, title, visible: visible ?? true } as Route
);

const menuMap = {
  root: [
    mapRoute('home', 'Home'),
    mapRoute('blog', 'Blog'),
    mapRoute('red33m', 'RED33M', isDevelopment),
  ],
  library: [
    mapRoute('videos', 'Videos'),
    mapRoute('literature', 'Literature', isDevelopment),
  ] as Route[],
  accessory: [
    mapRoute('red33m-auth', 'Auth', isDevelopment),
  ]
};

type RouteMap = typeof menuMap;

function normalizeRoutes(map: RouteMap) {
  // Not a performant clone
  const newMap = JSON.parse(JSON.stringify(map)) as RouteMap;
  let mapName: keyof RouteMap;
  for (mapName in newMap) {
    newMap[mapName] = newMap[mapName].filter(route => route.visible);
  }
  return newMap;
}


export function useRouteMap() {
  return normalizeRoutes(menuMap);
}