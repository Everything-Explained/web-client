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
      @keydown.tab.exact.prevent="onTab"
      @keyup="onTyping"
      @keydown="suggest"
      @keydown.backspace.exact="onBackspace"
      @blur="hints.clear()"
      @paste.prevent="onPaste"
    >&#xfeff;</div>
    <!-- The above character prevents command hint failure -->
  </div>
</template>


<script lang='ts' src='./_commander.ts'></script>
<style lang='sass' src='./_commander.sass'></style>
