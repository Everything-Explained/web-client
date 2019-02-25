


<template>
  <div @click="toggle" class="input-switch">
    <input type="checkbox" :checked="checked" />
    <span class="toggle-text-off">{{ offText }}</span>
    <span class="slider"></span>
    <span class="toggle-text-on">{{ onText }}</span>
  </div>
</template>



<script lang='ts' src='./_toggle.ts'></script>







<style lang='sass'>
$switchWidth: 80px
.input-switch
  position: relative
  display: inline-block
  width: $switchWidth
  height: 40px
  cursor: pointer

  [type='checkbox']
    opacity: 0
    width: 0
    height: 0

    ~ .slider
      position: absolute
      width: $switchWidth
      height: 40px
      border: 2px solid hsl(50, 70%, 30%);
      border-radius: 20px
      transition: border .2s .1s

      &::before
        position: absolute
        content: ''
        top: 4px
        width: 28px
        bottom: 4px
        right: $switchWidth - 36
        border-radius: 19px
        box-sizing: border-box
        background-color: hsl(50, 70%, 30%)
        transition: all .3s .1s, width .1s, top .1s, bottom .1s

    + .toggle-text-off
      position: absolute
      right: 8px
      line-height: 42px
      color: hsl(50, 30%, 50%)
      font-family: 'Nunito'
      font-size: 18px
      user-select: none

    ~ .toggle-text-on
      position: absolute
      top: 0
      bottom: 0
      left: 0
      right: 0
      line-height: 42px
      text-align: center
      font-family: 'Nunito'
      font-size: 22px
      color: hsla(0, 0, 0, 0)
      user-select: none

    &:checked ~ .slider
      border-color: hsl(131, 31%, 43%)
      transition: border .5s .15s
      &::before
        top: 3px
        width: $switchWidth - 10
        right: 3px
        bottom: 3px
        border-radius: 23px
        background-color: hsl(127, 52%, 70%)
        box-shadow: 0 0 16px hsl(131, 31%, 43%);
        transition: all .2s .1s, right .1s

    &:checked ~ .toggle-text-on
      color: hsl(133.3, 36%, 30%)
      transition: color .3s .15s

    &:checked ~ .toggle-text-off
      color: hsla(0, 0, 0, 0)
</style>