<template>
  <div class="red33m-auth">
    <ee-titlebar class="r3d-auth__titlebar">
      RED33M
    </ee-titlebar>
    <ee-text type="block" class="r3d-auth__disclaimer">
      This page contains sensitive content which <em>requires authentication</em>.
      If you have a passcode, use the form below to grant yourself access.
      <br><br>
      <strong>Don't have a Passcode?</strong>
      <br>
      Fill out the
      <router-link to="/red33m-form">
        {{ "EC Form" }} <!-- Removes spaces when rendered -->
      </router-link>
      to gain eligibility; filling out the form <em>does not</em>
      guarantee a Passcode, it only makes you eligible.
    </ee-text>
    <form class="r3d-auth__form">
      <ee-input v-model="code"
                class="r3d-auth__passcode"
                :minchars="3"
                :maxchars="6"
      >
        Passcode
      </ee-input>

      <ee-button class="r3d-auth__button"
                 type="submit"
                 theme="attention"
                 :loading="isLoading"
                 :disabled="!hasValidCode"
                 @click="submit"
      >
        ENTER
      </ee-button>

      <div :class="['r3d-auth__error', { '--on': isError }]">
        {{ errorText }}
      </div>
    </form>
    <br>
    <ee-text type='span-block' class="r3d-auth__note">
      <strong>NOTE:</strong> Do not clear your browser cache, otherwise you
      will need to enter the code again, when you come back to this page
      later.
    </ee-text>
    <ee-text class="r3d-auth__note" type='span-block'>
      <strong>CAVEAT:</strong> The passcode will only be saved for <em>this device</em>.
      In order to view this content on your other devices:
      <strong>computer, phone, tablet, etc...</strong>
      You <em>must enter the passcode again</em> on those devices.<br><br>
    </ee-text>
    <ee-footer />
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, ref } from "vue";
import eeButton from "@/components/ui/ee-button.vue";
import eeInputField from "@/components/ui/ee-input.vue";
import { useAPI } from "@/services/api_internal";
import eeText from '@/components/ui/ee-text.vue';
import { useRouter } from "vue-router";
import eeTitlebarVue from "@/components/layout/ee-titlebar.vue";
import eeFooterVue from "@/components/layout/ee-footer.vue";

export default defineComponent({
  components: {
    'ee-input'    : eeInputField,
    'ee-button'   : eeButton,
    'ee-titlebar' : eeTitlebarVue,
    'ee-text'     : eeText,
    'ee-footer'   : eeFooterVue,
  },
  setup() {
    const codeLength   = 6;
    const codeRef      = ref('');
    const errorTextRef = ref('');
    const isErrorRef   = ref(false);
    const hasValidCode = computed(() => codeRef.value.length == codeLength);
    const api          = useAPI();
    const authAPI      = api.auth;
    const router       = useRouter();

    let errorTimeout = 0;
    function setError(msg: string) {
      clearTimeout(errorTimeout);
      errorTextRef.value = msg.toUpperCase();
      isErrorRef.value   = true;
      errorTimeout       = setTimeout(() => isErrorRef.value = false, 2500);
    }

    const submit = (e: MouseEvent) => {
      e.preventDefault();
      const passcode = codeRef.value.toUpperCase();
      api.debounce(600, () => {
        authAPI
          .put('/red33m', { passcode })
          .then(() => {
            localStorage.setItem('passcode', 'yes');
            router.push('/red33m/videos');
          })
          .catch((err) => setError(err))
        ;
      });
    };

    return {
      isLoading: api.isPending,
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