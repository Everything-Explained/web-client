import { computed, reactive } from "vue";

const state = reactive({
  'blog': [] as any[],
  'changelog': [] as any[],
  'library/literature': [] as any[],
  'red33m/literature': [] as any[],
} as { [key: string]: any });

// NOTE: We are assuming that all contained non-primitive types will
//       NOT be mutated. E.g. [Object, Object] or { foo: ['bar'] }
export function useDateCache() {

  return {
    setArrayData: (key: string, val: any[]) => {
      catchMissingState(key);
      state[key] = val.slice();
    },
    updArrayData: (key: string, val: string|boolean|number) => {
      catchMissingState(key);
      (state[key] as any[]).push(val);
    },
    getArrayData: <T>(key: string) => {
      catchMissingState(key);
      return computed(() => (state[key]?.slice() || []) as T[]);
    },

    setObjData: (key: string, val: any) => {
      catchMissingState(key);
      state[key] = { ...val };
    },
    getObjData: <T>(key: string) => {
      catchMissingState(key);
      return computed(() => ({ ...state[key] } as T));
    },

    setData: (key: DataKeys, val: string|boolean|number) => {
      catchMissingState(key);
      state[key] = val;
    },
    getData: <T>(key: DataKeys) => {
      catchMissingState(key);
      return computed(() => state[key] as T);
    }
  };
}

function catchMissingState(key: string) {
  if (undefined == state[key]) throw Error(`Missing Cache Entry::${key}`);
}


