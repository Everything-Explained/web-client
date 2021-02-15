<template>
  <button :class="['ee-btn', theme, { '--loading': isLoading }]"
          :type="undefined"
          :disabled="isDisabled"
  >
    <slot />
  </button>
</template>



<script src='./ee-button' lang='ts'></script>