import { Ref, ref } from "vue";
import { isProduction } from "../globals";
import wretch, { ResponseChain, Wretcher } from 'wretch';

type RequestBody = { [key: string]: string|number|boolean }

const sanitizeURLForEnv = (url: string) => {
  return isProduction ? url : `//localhost:3003${url}`;
};

export function useDataAPI() {
  const isLoading = ref(false);
  const baseAPI = wretch().url(sanitizeURLForEnv('/api/data'));
  return {
    get(
      endpoint   : string,
      errHandler : null|((err: string) => void),
      query?     : { [key: string]: string|number }
    ) {
      isLoading.value = true;
      return new Promise((rs, rj) => {
        const exec = () => {
          const id = localStorage.getItem('userid');
          // Wait for user ID
          if (!id) return setTimeout(() => exec(), 300);
          const sendError = (() => {
            return errHandler ? errHandler : rs;
          })();

          let api = baseAPI.url(`${endpoint}.json`).auth(`Bearer ${id || 'none'}`);
          if (query) api = api.query(query);
          api
            .get()
            .notFound(() => sendError('Endpoint Not Found'))
            .json(res => rs(res))
            .catch(err => sendError(err?.message))
            .finally(() => isLoading.value = false)
          ;
        };

        exec();
      });
    },
    isLoading
  };
}

export function useAuthAPI() {
  const isLoading = ref(false);
  const api = wretch().url(sanitizeURLForEnv('/api/auth'));
  function exec( method: 'put'|'post', endpoint: string, body: RequestBody, delay = 0): Promise<true|string> {
    return new Promise((rs, rj) => {
      const id = localStorage.getItem('userid');
      setTimeout(() => {
        api
          .url(endpoint)
          .auth(`Bearer ${id || 'none'}`)[method](body)
            .notFound(() => rj('Endpoint Not Found'))
            .res(() => rs(true))
            .catch((err) => { rj(err?.message); })
            .finally(() => isLoading.value = false)
        ;
      }, delay);
    });
  }
  return {
    post(endpoint: string, body: any, delay = 0): Promise<true|string> {
      isLoading.value = true;
      return exec('post', endpoint, body, delay);
    },
    put(endpoint: string, body: any, delay = 0) {
      isLoading.value = true;
      return exec('put', endpoint, body, delay);
    },
    isLoading
  };
}