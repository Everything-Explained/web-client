<template>
  <div class="chat">
    <div class="top-wrapper">
      <display :scale="displayScale" :messages="messages"></display>
      <userlist :users="users" scale="normal"></userlist>
    </div>
    <commander :chat="$this" :sock="socket"></commander>
  </div>
</template>


<script lang='ts' src='./_chat.ts'></script>
<style lang='sass' src='./_chat.sass'></style>