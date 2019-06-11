<template>
  <div>
    <!-- INLINE MESSAGES -->
    <div
      v-if="isInline"
      class="chat-message"
      :class="[inlineClass, scaleClass]"
    >
      <div class="content" :class="priorityClass">
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


    <!-- NORMAL MESSAGE (INLINE-VERSION WIP) -->
    <div
      v-if="type == 'normal-inline'"
      class="chat-message"
      :class="[scaleClass, 'normal-inline']"
    >
      <div class="content">
        <div class="time">{{ time }}</div>
        <div class="alias"
          >{{ alias }}<span class="text markdown md-message" v-html="sanitizedContent"></span>
        </div>
      </div>
    </div>


    <!-- NORMAL MESSAGES -->
    <div
      v-if="type =='normal'"
      class="chat-message normal"
      :class="scaleClass"
    >
      <img :src="avatar" class="avatar" />
      <div class="content">
        <div class="infobar">
          <div class="alias">{{ alias }}</div>
          <div class="time">{{ time }}</div>
        </div>
        <div
          v-for="(line, i) of content"
          :key="i"
          class="text markdown md-message"
          v-html="sanitizeContent(line)"
        ></div>
      </div>
    </div>
  </div>
</template>


<script lang='ts' src='./_message.ts'></script>
<style lang='sass' src='./_message.sass'></style>
<!-- Markdown styles imported from markdown.sass (md_chat_message) -->