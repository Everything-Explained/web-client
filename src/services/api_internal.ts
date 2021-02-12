import { ref } from "vue";
import { isProduction } from "../globals";
import wretch from 'wretch';

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
        const sendError = (() => {
          return errHandler ? errHandler : rs;
        })();

        let api = baseAPI.url(`${endpoint}.json`);
        if (query) api = api.query(query);
        api
          .get()
          .notFound(() => sendError('Endpoint Not Found'))
          .json(res => rs(res))
          .catch(err => sendError(err?.message))
          .finally(() => isLoading.value = false)
        ;
      });
    },
    isLoading
  };
}

export function useAuthAPI() {
  const isLoading = ref(false);
  const api = wretch().url(sanitizeURLForEnv('/api/auth'));
  return {
    /**
     * POSTs data to the specified authentication endpoint.
     *
     * @param endpoint Name of the authentication endpoint to use
     * @param body The form data to send with the POST
     * @param delay How long to wait in `ms" until executing request. The default is "0`
     */
    post(
        endpoint   : string,
        body       : { [key: string]: string|number },
        errHandler : null | ((err: string) => void),
        delay = 0
    ): Promise<true|string> {
      isLoading.value = true;
      return new Promise((rs) => {
        const sendError = (() => {
          return errHandler ? errHandler : rs;
        })();
        setTimeout(() => {
          api
            .url(endpoint)
            .formUrl(body)
            .post()
            .notFound(() => sendError('Endpoint Not Found'))
            .res(() => rs(true))
            .catch(err => sendError(err?.message))
            .finally(() => isLoading.value = false)
          ;
        }, delay);
      });
    },
    isLoading
  };
}