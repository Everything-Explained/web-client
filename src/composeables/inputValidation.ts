import { ref, computed } from "@vue/reactivity";


export default function useInputValidation(inputs: number) {
  const ids = ref<string[]>([]);
  return {
    validate(v: boolean, id: string) {
      const inputIndex = ids.value.indexOf(id);
      if (v && !~inputIndex) ids.value.push(id);
      if (!v && ~inputIndex) ids.value.splice(inputIndex, 1);
      if (ids.value.length > inputs)
        throw Error('useFormValidation::Too Many Fields')
      ;
    },
    isValidated : computed(() => ids.value.length == inputs),
    remaining   : computed(() => inputs - ids.value.length),
  };
}