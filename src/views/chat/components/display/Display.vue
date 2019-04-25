<template>
  <div class="display">
    <div class="msg-container">
      <div class="message scale-normal" v-for="(msg, i) of messages" :key="i">
        <img :src="msg.avatar" class="avatar" />
        <div class="content">
          <div class="infobar">
            <div class="alias">{{ msg.alias }}</div>
            <div class="time">{{ msg.time }}</div>
          </div>
          {{ msg.content }}
        </div>
      </div>
    </div>
  </div>
</template>


<script lang='ts' src='./_display.ts'></script>
<style lang='sass' src='./_display.sass'></style>