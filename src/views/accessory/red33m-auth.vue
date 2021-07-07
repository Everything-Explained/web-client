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
      <router-link to="/red33m/form">
        {{ "EC Form" }} <!-- Removes spaces when rendered -->
      </router-link>
      to gain eligibility; filling out the form <em>does not</em>
      guarantee a Passcode, it only makes you eligible.
    </ee-text>
    <form class="r3d-auth__form">
      <ee-input
        v-model="code"
        class="r3d-auth__passcode"
        :minchars="6"
        :maxchars="6"
        :validate="validate"
      >
        Passcode
      </ee-input>

      <ee-button
        class="r3d-auth__button"
        type="submit"
        theme="attention"
        :loading="isLoading"
        :disabled="!isValidated"
        @click="submit"
      >
        ENTER
      </ee-button>
      <br>
      <ee-form-error
        class="r3d-auth__error"
        :update="errorUpdVal"
        :text="errorText"
      />
    </form>
    <br>
    <ee-text type="span-block" class="r3d-auth__note">
      <strong>NOTE:</strong> Do not clear your browser cache, otherwise you
      will need to enter the code again, when you come back to this page
      later.
    </ee-text>
    <ee-text type="span-block" class="r3d-auth__note">
      <strong>CAVEAT:</strong> The passcode will only be saved for <em>this device</em>.
      In order to view this content on your other devices:
      <strong>computer, phone, tablet, etc...</strong>
      You <em>must enter the passcode again</em> on those devices.<br><br>
    </ee-text>
    <ee-footer />
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref } from "vue";
import eeButton from "@/components/ui/ee-button.vue";
import eeInputField from "@/components/ui/ee-input.vue";
import { APIErrorResp, useAPI } from "@/services/api_internal";
import eeText from '@/components/ui/ee-text.vue';
import { useRouter } from "vue-router";
import eeTitlebarVue from "@/components/layout/ee-titlebar.vue";
import eeFooterVue from "@/components/layout/ee-footer.vue";
import eeFormErrorVue from "@/components/ui/ee-form-error.vue";
import useInputValidation from "@/composeables/inputValidation";

export default defineComponent({
  components: {
    'ee-input'      : eeInputField,
    'ee-button'     : eeButton,
    'ee-titlebar'   : eeTitlebarVue,
    'ee-text'       : eeText,
    'ee-footer'     : eeFooterVue,
    'ee-form-error' : eeFormErrorVue,
  },
  setup() {
    const codeLength   = 6;
    const codeRef      = ref('');
    const errorTextRef = ref('');
    const errorUpdVal  = ref(0);
    const api          = useAPI();
    const router       = useRouter();
    const inputValidation = useInputValidation(1);

    function setError(res: APIErrorResp) {
      errorTextRef.value = res.message;
      errorUpdVal.value = Date.now();
    }

    function submit(e: MouseEvent) {
      e.preventDefault();
      const passcode = codeRef.value.toUpperCase();
      api.debounce(200, () => {
        api
          .put('/auth/red33m', { passcode })
          .then(() => {
            localStorage.setItem('passcode', 'yes');
            router.push('/red33m/videos');
          })
          .catch(setError)
        ;
      });
    }

    return {
      isLoading: api.isPending,
      code: codeRef,
      codeLength,
      submit,
      ...inputValidation,
      errorText: errorTextRef,
      errorUpdVal,
    };
  }
});
</script>