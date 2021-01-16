import { isProduction } from "../globals";

const api_root_url =
  isProduction
    ? '/api/data'
    : 'https://localhost:3003/api/data'
;

export function useDataAPI() {
  return {
    get: (dir: string, assetName: string) => {
      return new Promise((rs, rj) => {
        fetch(`${api_root_url}/${dir}/${assetName}.json`)
          .then(res => rs(res.json()))
          .catch(err => rj(err.message));
      });
    }
  };
}