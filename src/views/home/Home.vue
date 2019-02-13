<template>
  <div>
    <markdown-paging
      :pages='home'
      :selectedPage='page'
      placeholder='#### select a topic on the left'
      :mdClass="'md-welcome'"
    ></markdown-paging>
  </div>
</template>

<script lang="ts" src='./home.ts'></script>
<style lang='sass' src='@/styles/markdown/_md_welcome.sass'></style>