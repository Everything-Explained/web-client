<template>
  <div>
    <!-- SERVER MESSAGES -->
    <div
      v-if="type == 'server'"
      class="chat-message inline server"
      :class="scaleClass"
    >
      <div class="content server">
        <i class="nou-circle first"></i>
        <div class="alias">{{ alias }}</div>
        <i class="nou-circle last"></i>
        <div class="text"><slot></slot></div>
        <div class="time">{{ time }}</div>
      </div>
    </div>

    <!-- INLINE MESSAGES -->
    <div
      v-if="isInline"
      class="chat-message inline"
      :class="scaleClass"
    >
      <img v-if="type == 'inline-avatar'" :src="avatar" class="avatar" />
      <div class="content">
        <div class="alias">{{ alias }}</div>
        <slot></slot>
        <div class="time">{{ time }}</div>
      </div>
    </div>

    <!-- NORMAL MESSAGES -->
    <div
      v-if="type =='normal'"
      class="chat-message"
      :class="scaleClass"
    >
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