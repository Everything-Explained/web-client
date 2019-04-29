<template>
  <div class="display">
    <div class="msg-container">
      <message
        v-for="(msg, i) of messages"
        :key="i"
        :alias="msg.alias"
        :avatar="msg.avatar"
        type="server"
        scale="normal"
      >
        {{ msg.content }}
      </message>
    </div>
  </div>
</template>


<script lang='ts' src='./_display.ts'></script>
<style lang='sass' src='./_display.sass'></style>