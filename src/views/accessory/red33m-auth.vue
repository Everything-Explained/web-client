<template>
  <div class="red33m-auth">
    <title-bar>RED33M Authentication</title-bar>

    <ee-text type='block' class="r3d-auth__disclaimer"><br>

      This page contains sensitive content which <em>requires authentication</em>.
      If you have a passcode, use the form below to grant yourself access.<br><br>

      <strong>NOTE:</strong> Do not clear your browser cache, otherwise you
      will need to enter the code again, when you come back to this page
      later.<br><br>

      <strong>CAVEAT:</strong> The passcode will only be saved for <em>this device</em>.
      In order to view this content on your other devices:
      <strong>computer, phone, tablet, etc...</strong>
      You <em>must enter the passcode again</em> on those devices.<br><br>

      <strong>Don't have a Passcode?</strong> Fill out the
      <router-link to='/red33m-form'>RED33M Form</router-link>
      to gain eligibility; filling out the form <em>does not</em>
      guarantee a Passcode, it only makes you eligible.<br><br>

    </ee-text>

    <form class="r3d-auth__form">
      <ee-input class="r3d-auth__passcode"
        v-model="code"
        :maxchars="6"
      >Passcode</ee-input>

      <ee-button
        @click="submit"
        type='submit'
        theme='attention'
        class="r3d-auth__button"
        :loading='isLoading'
        :disabled='!hasValidCode'
      >ENTER</ee-button>

      <div :class="['r3d-auth__error', { '--on': isError }]">{{ errorText }}</div>
    </form>

    <ee-footer></ee-footer>

  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, ref } from "vue";
import eeButton from "@/components/ui/ee-button.vue";
import eeInputField from "@/components/ui/ee-input.vue";
import titlebar from "@/components/layout/titlebar.vue";
import footer from '@/components/layout/footer.vue';
import { useAuthAPI } from "@/services/api_internal";
import eeText from '@/components/ui/ee-text.vue';
import { useRouter } from "vue-router";

export default defineComponent({
  components: {
    'ee-input' : eeInputField,
    'ee-button': eeButton,
    'title-bar': titlebar,
    'ee-footer': footer,
    'ee-text'  : eeText,
  },
  setup() {
    const codeLength   = 6;
    const codeRef      = ref('');
    const errorTextRef = ref('');
    const isErrorRef   = ref(false);
    const hasValidCode = computed(() => codeRef.value.length == codeLength);
    const authAPI      = useAuthAPI();
    const router       = useRouter();

    let errorTimeout = 0;
    function setError(msg: string) {
      clearTimeout(errorTimeout);
      errorTextRef.value = msg.toUpperCase();
      isErrorRef.value   = true;
      errorTimeout       = setTimeout(() => isErrorRef.value = false, 2500);
    };

    function genID() {
      return btoa(`${Date.now()}|${Math.floor(Math.random() * 10000)}`);
    }

    const submit = (e: MouseEvent) => {
      e.preventDefault();
      const passcode = codeRef.value.toUpperCase();
      const params = {
        passcode,
        userid: localStorage.getItem('userid')!
      }
      authAPI
        .post('/red33m', params, setError, 500)
        .then(() => {
          localStorage.setItem('passcode', 'yes');
          router.push('/red33m')
        })
    };

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
</script>