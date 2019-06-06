<template>
  <div class="chat">
    <div class="top-wrapper">
      <display
        :scale="displayScale"
        :messages="messages"
        :msg-style="messageStyle"
      ></display>
      <userlist
        :users="users"
        scale="normal"
        @notice-command="userListNotice"
      ></userlist>
    </div>
    <commander
      :chat="$this"
      :sock="socket"
      ref="commander"
    ></commander>
  </div>
</template>


<script lang='ts' src='./_chat.ts'></script>
<style lang='sass' src='./_chat.sass'></style>