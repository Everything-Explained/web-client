import { isProduction } from "../globals";

const api_root_url =
  isProduction
    ? '/api/pageData'
    : 'https://localhost:3003/api/pageData'
;

export function usePageDateAPI() {
  return {
    get: (pageName: string) => {
      return new Promise((rs, rj) => {
        fetch(`${api_root_url}/${pageName}.json`)
          .then(res => rs(res.json()))
          .catch(err => rj(err.message));
      });
    }
  };
}