import { ref, computed } from "@vue/reactivity";


export default function useInputValidation(fields: number) {
  const ids = ref<string[]>([]);
  return {
    validateInput(v: boolean, id: string) {
      const fieldIndex = ids.value.indexOf(id);
      if (v && !~fieldIndex) ids.value.push(id);
      if (!v && ~fieldIndex) ids.value.splice(fieldIndex, 1);
      if (ids.value.length > fields)
        throw Error('useFormValidation::Too Many Fields')
      ;
    },
    allInputsValidated: computed(() => ids.value.length == fields)
  };
}