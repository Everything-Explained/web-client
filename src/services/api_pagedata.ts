
const api_root_url =
  process.env.NODE_ENV  == 'production'
    ? '/pageData'
    : '//localhost:3003/pageData'
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