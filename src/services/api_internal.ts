import { reactive, computed } from "vue";
import { isProduction } from "../globals";
import wretch from 'wretch';

type RequestBody   = { [key: string]: string|number|boolean }
type ErrorHandler  = null|((msg: string) => void);
type Query         = { [key: string]: string|number };
type AuthMethod    = 'put'|'post'|'get';
type AuthReturn    = Promise<{ status: number, data: string }>;

const sanitizeURLForEnv = (url: string) => {
  return isProduction ? url : `//localhost:3003${url}`;
};

const genUniqueID = () =>
  crypto
    .getRandomValues(new Uint8Array(20))
    .reduce((pv, cv) => pv += `${cv.toString(36)}`, '')
;

const state = reactive({
  userid: localStorage.getItem('userid') || genUniqueID(),
  isInitialized: false,
  initializing: false,
  version: localStorage.getItem('version') || '',
  isLoading: false,
  isDebouncing: false,
});

const dataEndpoint =
  wretch().url(sanitizeURLForEnv('/api/data')).auth(`Bearer ${state.userid || 'none'}`)
;

const authEndpoint =
  wretch().url(sanitizeURLForEnv('/api/auth')).auth(`Bearer ${state.userid || 'none'}`)
;

async function init() {
  state.initializing = true;
  // Is always a valid userid
  localStorage.setItem('userid', state.userid)
  ;
  const res = await authAPI.get('/setup', { userid: state.userid });
  // User id created
  if (res.status == 201) localStorage.setItem('passcode', 'no');
  if (!state.version || state.version != res.data) {
    localStorage.setItem('version', res.data);
    state.version = res.data;
  }
  state.isInitialized = true;
}


const dataAPI = {
  get(resource: string, errHandler?: ErrorHandler, query?: Query) {
    return new Promise((rs) => {
      checkInitialization();
      if (debounceOnPending(rs, () => dataAPI.get(resource, errHandler, query))) return;
      state.isLoading = true;
      const sendError = errHandler ? errHandler : rs;
      const queryObj = query
        ? { ...query, version: state.version }
        : { version: state.version }
      ;
      dataEndpoint
        .url(`${resource}.json`)
        .query(queryObj)
        .get()
        .notFound(() => sendError('Endpoint Not Found'))
        .json(res => rs(res))
        .catch(err => sendError(err?.message))
        .finally(() => state.isLoading = false)
      ;
    });
  }
};


const authAPI = {
  exec(resource: string, method: AuthMethod, body: RequestBody): AuthReturn {
    return new Promise((rs, rj) => {
      checkInitialization();
      if (debounceOnPending(rs, () => authAPI.exec(resource, method, body))) return;
      state.isLoading = true;
      const api = method == 'get'
        ? authEndpoint.url(resource).query(body)[method]()
        : authEndpoint.url(resource)[method](body)
      ;
      api
        .notFound(    () => rj('Endpoint Not Found'))
        .res(async (res) => rs({ status: res.status, data: await res.text() }))
        .catch(    (err) => rj(err?.message))
        .finally(     () => state.isLoading = false)
      ;
    });
  },
  post: (endpoint: string, body: any) => authAPI.exec(endpoint, 'post', body),
  put : (endpoint: string, body: any) => authAPI.exec(endpoint, 'put',  body),
  get : (endpoint: string, body: any) => authAPI.exec(endpoint, 'get',  body)
};


function checkInitialization() {
  if (!state.isInitialized && !state.initializing) {
    const err = Error('useAPI() is NOT initialized');
    console.error(err);
    throw err;
  }
}


function debounceOnPending(rs: (val: any) => void, cb: () => Promise<any>) {
  if (state.isLoading || state.isDebouncing) {
    debounce(100, () => rs(cb()));
    return true;
  }
  return false;
}


function debounce(delay: number, func: () => void) {
  state.isDebouncing = true;
  setTimeout(() => {
    state.isDebouncing = false;
    func();
  }, delay);
}


export function useAPI() {
  return {
    init,
    debounce,
    auth: authAPI,
    data: dataAPI,
    isPending: computed(() => state.isDebouncing || state.isLoading)
  };
}