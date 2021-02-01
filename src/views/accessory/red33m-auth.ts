import { computed, defineComponent, ref } from "vue";
import eeButton from "@/components/ui/ee-button.vue";
import eeInputField from "@/components/ui/ee-input-field.vue";
import titlebar from "@/components/layout/titlebar.vue";
import footer from '@/components/layout/footer.vue';
import { useStore } from "vuex";
import { VuexStore } from "@/vuex/vuex-store";
import { useAuthAPI } from "@/services/api_internal";
import eeText from '@/components/ui/ee-text.vue';
import { useRouter } from "vue-router";

export default defineComponent({
  components: {
    'ee-input': eeInputField,
    'ee-button': eeButton,
    'title-bar': titlebar,
    'ee-footer': footer,
    'ee-text': eeText,
  },
  setup() {
    const codeLength   = 6;
    const codeRef      = ref('');
    const errorTextRef = ref('');
    const isErrorRef   = ref(false);
    const hasValidCode = computed(() => codeRef.value.length == codeLength);
    const store        = useStore<VuexStore>();
    const authAPI      = useAuthAPI();
    const router       = useRouter();

    let errorTimeout = 0;
    const setError = (msg: string) => {
      clearTimeout(errorTimeout);
      errorTextRef.value = msg.toUpperCase();
      isErrorRef.value   = true;
      errorTimeout       = setTimeout(() => isErrorRef.value = false, 2500);
    };

    const submit = async (e: MouseEvent) => {
      e.preventDefault();
      const passcode = codeRef.value.toUpperCase();
      const params = new URLSearchParams([['passcode', passcode]]);
      try {
        const res = await authAPI.post('red33m', params, 500);
        if (typeof res == 'string') return setError(res);
        localStorage.setItem('passcode', passcode);
        router.push('/red33m');
      }
      catch (err) { setError(err?.message || err); }
    };

    store.commit('page-title', 'RED33M Authentication');

    return {
      isLoading: authAPI.isLoading,
      hasValidCode,
      code: codeRef,
      codeLength,
      isError: isErrorRef,
      submit,
      errorText: errorTextRef,
    };
  }
});