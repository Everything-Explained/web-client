<template>
  <div>
    <!-- SERVER MESSAGES -->
    <div
      v-if="type == 'server'"
      class="chat-message inline server"
      :class="scaleClass"
    >
      <div class="content server" :class="priorityClass">
        <div class="time">{{ time }}</div>
        <i class="nou-circle first"></i>
        <div class="alias">{{ alias }}</div>
        <i class="nou-circle last"></i>
        <div class="text markdown md-message" v-html="sanitizedContent"></div>
      </div>
    </div>


    <!-- IMPLICIT MESSAGES -->
    <div
      v-if="isImplicit"
      class="chat-message implicit"
      :class="[implicitClass, scaleClass]"
    >
      <div class="content">
        <i class="nou-right-open-mini"></i>
        <div class="alias implicit"
          >{{ alias }}
            <span class="notice-says" v-if="isNotice"
              >tells you&nbsp;
            </span>
        </div>
        <div class="text implicit markdown md-message" v-html="sanitizedContent"></div>
      </div>
    </div>


    <!-- NORMAL INLINE MESSAGE -->
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
        <div class="text markdown md-message" v-html="sanitizedContent"></div>
      </div>
    </div>
  </div>
</template>


<script lang='ts' src='./_message.ts'></script>
<style lang='sass' src='./_message.sass'></style>