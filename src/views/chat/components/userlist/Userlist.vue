<template>
  <div class="userlist" :class="scaleClass">
    <div
      class="user"
      v-for="(user, i) of users"
      :key="i"
      :class="{
        idle: user.idle,
        away: user.away,
        nostatus: user.nostatus
      }"
    >
      <i
        class="nou-circle status"
      ></i>
      <div
        class="user-name"
        :class="{
          'typing': user.isTyping,
          'typing-paused': user.isTypingPaused
        }"
        @dblclick="noticeUser(user.alias)"
      >{{ user.alias }}</div>
    </div>
  </div>
</template>




<script lang='ts' src='./_userlist.ts'></script>
<style lang='sass' src='./_userlist.sass'></style>


