<template>
  <div class="auth-input">
    <div class="input-wrapper">
      <input type="text" spellcheck="false"
        :maxlength="max"
        v-model="textInput"
      />

      <span
        class="status error"
        v-if="state.invalid1"
      ><slot name="invalid1"></slot></span>

      <span
        class="status error"
        v-else-if="state.invalid2"
      ><slot name="invalid2"></slot></span>

      <span
        class="status error"
        v-else-if="state.invalid3"
      ><slot name="invalid3"></slot></span>

      <span
        class="status error"
        v-else-if="state.failedValidation"
      >{{ failedValidationText }}</span>

      <span
        class="status neutral"
        v-else-if="state.checkingValidation"
      >
        <div class="preloader left"></div>
        ...Checking {{ validationType }}...
        <div class="preloader right"></div>
      </span>

      <span
        class="status error"
        v-else-if="state.underMin"
      >Too Short</span>

      <span
        class="status error"
        v-else-if="state.overMax"
      >Too Long</span>

      <span
        class="status success"
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
    width: 100%
    padding: 5px 8px
    box-shadow: 0 0 15px 5px black, inset 0 0 30px -1px black

  [type='text']
    background-color: transparent
    width: 100%
    margin: 0
    padding: 0
    padding-bottom: 3px
    border-bottom: 2px solid hsl(0, 0, 25%)
    font-size: 22px
    font-family: 'Cousine'
    color: hsl(50, 50%, 50%)

  .status
    position: relative
    display: block
    padding-top: 2px
    width: 100%
    background-color: transparent
    color: hsl(0, 0%, 50%)
    font-size: 18px
    font-family: monospace
    font-weight: bold
    &.error
      color: hsl(0, 70%, 70%)
      text-transform: capitalize
    &.success
      color: hsl(126, 80%, 80%)
    &.neutral
      color: hsl(278, 50%, 80%)
      text-align: center

  .preloader
    position: absolute
    width: 23px
    height: 23px
    line-height: 23px
    display: inline-block
    margin: 0
    &.right
      right: 10px
    &.left
      left: 10px

</style>