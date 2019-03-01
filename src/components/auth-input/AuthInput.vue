<template>
  <div class="auth-input">
    <div class="input-wrapper">
      <input type="text" spellcheck="false"
        v-model="textInput"
      />

      <span
        class="status invalid"
        v-if="state.invalid"
      ><slot name="invalid"></slot></span>

      <span
        class="status invalid"
        v-else-if="state.underMin"
      >Too Short</span>

      <span
        class="status invalid"
        v-else-if="state.overMax"
      >Too Long</span>

      <span
        class="status valid"
        v-else-if="state.valid"
      ><slot name="valid"></slot></span>

      <span
        class="status"
        v-else
      ><slot></slot></span>
    </div>
  </div>
</template>



<script lang='ts' src='./_auth-input.ts'></script>



<style lang='sass'>
@import '../../styles/controls/inputs'


.auth-input
  .input-wrapper
    @extend %input
    width: 288px
    padding: 3px 3px

  [type='text']
    background-color: hsl(0, 0%, 9%)
    width: 100%
    margin: 0
    padding: 0
    border-bottom: 2px solid hsl(0, 0, 25%)
    font-size: 22px
    font-family: 'Source Code Pro'
    color: hsl(50, 50%, 50%)

  .status
    position: relative
    display: block
    padding-top: 2px
    width: 100%
    color: hsl(0, 0%, 50%)
    font-size: 18px
    font-family: monospace
    font-weight: bold
    &.invalid
      color: hsl(0, 70%, 70%)
    &.valid
      color: hsl(126, 80%, 80%)

</style>