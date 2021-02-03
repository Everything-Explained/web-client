<template>
  <div class="red33m-auth">
    <title-bar>RED33M Authentication</title-bar>

    <ee-text type='block' class="r3d-auth__disclaimer"><br>

      This page contains sensitive content which <em>requires authentication</em>.
      If you have a passcode, use the form below to grant yourself access.<br><br>

      <strong>NOTE:</strong> When you've <strong>successfully</strong> entered
      the code, it is saved in your browser cache so that you don't have to keep
      entering it over and over...<br><br>

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
        :maxlength='codeLength'
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

<script lang='ts' src='./red33m-auth'></script>