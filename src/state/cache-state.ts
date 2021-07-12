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
    getArrayData: <T>(key: string) => {
      catchMissingState(key);
      return computed(() => (state[key]?.slice() || []) as T[]);
    },

    setObjData: (key: string, val: any) => {
      catchMissingState(key);
      state[key] = { ...val };
    },
    getObjData: (key: string) => {
      catchMissingState(key);
      return computed(() => ({ ...state[key] }));
    },

    setPrimitiveData: (key: string, val: string|boolean|number) => {
      catchMissingState(key);
      state[key] = val;
    },
    getPrimitiveData: (key: string) => {
      catchMissingState(key);
      return computed(() => state[key]);
    }
  };
}

function catchMissingState(key: string) {
  if (undefined == state[key]) throw Error(`Missing Cache Entry::${key}`);
}


