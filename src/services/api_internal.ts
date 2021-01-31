import { ref } from "vue";
import { isProduction } from "../globals";

const sanitizeURLForEnv = (url: string) => {
  return isProduction ? url : `https://localhost:3003${url}`;
};

const _apiDataURL = sanitizeURLForEnv('/api/data');
const _apiAuthURL = sanitizeURLForEnv('/api/auth');

export function useDataAPI() {
  return {
    get: (dir: string, assetName: string) => {
      return new Promise((rs, rj) => {
        fetch(`${_apiDataURL}/${dir}/${assetName}.json`)
          .then(res => rs(res.json()))
          .catch(err => rj(err.message))
        ;
      });
    }
  };
}

export function useAuthAPI() {
  const isLoading = ref(false);
  return {
    /**
     * POSTs data to the specified authentication endpoint.
     *
     * @param endpoint Name of the authentication endpoint to use
     * @param body The form data to send with the POST
     * @param delay How long to wait in `ms` until executing request. The default is `0`
     */
    post: (endpoint: string, body: URLSearchParams, delay = 0): Promise<Response> => {
      isLoading.value = true;
      return new Promise((rs, rj) => {
        setTimeout(() => {
          fetch(`${_apiAuthURL}/${endpoint}`,
            { method: 'post', body }
          )
            .then(res =>  { isLoading.value = false; rs(res);         })
            .catch(err => { isLoading.value = false; rj(err.message); })
          ;
        }, delay);
      });
    },
    isLoading
  };
}