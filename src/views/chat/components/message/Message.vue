<template>
  <div>
    <div v-if="false" class="chat-message inline scale-normal">
      <div class="content">
        <div class="alias">{{ alias }}</div>
        <slot></slot>
        <div class="time">{{ time }}</div>
      </div>
    </div>
    <div v-if="true" class="chat-message scale-normal">
      <img :src="avatar" class="avatar" />
      <div class="content">
        <div class="infobar">
          <div class="alias">{{ alias }}</div>
          <div class="time">{{ time }}</div>
        </div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>


<script lang='ts' src='./_message.ts'></script>
<style lang='sass' src='./_message.sass'></style>