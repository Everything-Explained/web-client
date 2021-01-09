type Route = {
  path: { name: string }
  title: string;
  visible: boolean;
}

const isDevelopment = process.env.NODE_ENV == 'development';

const mapRoute = (name: string, title: string, visible?: boolean) => (
  { path: { name }, title, visible: visible ?? true } as Route
);

const menuMap = {
  root: [
    mapRoute('home', 'Home'),
    mapRoute('blog', 'Blog'),
    mapRoute('red33m', 'RED33M', isDevelopment)
  ],
  categories: {
    library: [
      mapRoute('videos', 'Videos'),
      mapRoute('literature', 'Literature', isDevelopment),
    ] as Route[]
  }
};

type RouteMap = typeof menuMap;

function normalizeRoutes(map: RouteMap) {
  // Not performant
  const newMap = JSON.parse(JSON.stringify(map)) as RouteMap;
  newMap.root = map.root.filter(route => route.visible);
  newMap.categories.library = map.categories.library.filter(route => route.visible);
  return newMap;
}


export function useRouteMap() {
  return normalizeRoutes(menuMap);
}