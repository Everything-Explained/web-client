import { computed, defineComponent, ref } from "vue";
import eeButton from "@/components/ui/ee-button.vue";
import eeInputField from "@/components/ui/ee-input-field.vue";
import titlebar from "@/components/layout/titlebar.vue";
import footer from '@/components/layout/footer.vue';
import { useStore } from "vuex";
import { VuexStore } from "@/vuex/vuex-store";
import { useAuthAPI } from "@/services/api_internal";

export default defineComponent({
  components: {
    'ee-input': eeInputField,
    'ee-button': eeButton,
    'title-bar': titlebar,
    'ee-footer': footer,
  },
  setup() {
    const codeLength = 6;
    const code = ref('');
    const hasValidCode = computed(() => code.value.length == codeLength);
    const store = useStore<VuexStore>();
    const isError = ref(false);
    const errorText = ref('');
    const authAPI = useAuthAPI();

    let errorTimeout = 0;
    const setError = (msg: string) => {
      clearTimeout(errorTimeout);
      errorText.value = msg.toUpperCase();
      isError.value = true;
      errorTimeout = setTimeout(() => isError.value = false, 2500);
    };

    const submit = async (e: MouseEvent) => {
      e.preventDefault();
      const params = new URLSearchParams([['passcode', code.value.toUpperCase()]]);
      try {
        const res = await authAPI.post('red33m', params, 500);
        if (res.status == 404) { return setError('Endpoint Not Found'); }
        if (res.status > 200)  { return setError(await res.text());     }
      }
      catch (err) { setError(err); }
    };

    store.commit('page-title', 'RED33M Authentication');

    return {
      isLoading: authAPI.isLoading,
      hasValidCode,
      code,
      codeLength,
      isError,
      submit,
      errorText,
    };
  }
});