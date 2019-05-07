<template>
  <div class="commander">
    <div
      id="cmdbox"
      contenteditable="true"
      spellcheck="false"
      ref="cmdbox"
      @keydown.enter.exact.prevent="onEnter"
      @keydown.up.exact.prevent="onUp"
      @keydown.down.exact.prevent="onDown"
      @keyup="onTyping"
    ></div>
  </div>
</template>


<script lang='ts' src='./_commander.ts'></script>
<style lang='sass' src='./_commander.sass'></style>
