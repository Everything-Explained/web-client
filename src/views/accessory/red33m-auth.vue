<template>
  <div class="red33m-auth">
    <title-bar></title-bar>

    <div class="r3d-auth__disclaimer">
      This page contains sensitive content which requires authentication.
      If you have a passcode, enter it below.
    </div>

    <form class="r3d-auth__form">
      <ee-input class="r3d-auth__passcode"
        v-model="code"
        :maxlength='codeLength'
      >Passcode</ee-input>

      <ee-button
        @click="submit"
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