<template>
  <div class="userlist" :class="scaleClass">
    <div
      class="user"
      v-for="(user, i) of users"
      :key="i"
    >
      <i
        class="nou-circle status"
        :class="{
          idle: user.idle,
          away: user.away,
          nostatus: user.nostatus
        }"
      ></i>
      <div
        class="user-name"
        :class="{
          'typing': user.typing,
          'typing-paused': user.typingPaused
        }"
      >{{ user.alias }}</div>
    </div>
  </div>
</template>




<script lang='ts' src='./_userlist.ts'></script>
<style lang='sass' src='./_userlist.sass'></style>


