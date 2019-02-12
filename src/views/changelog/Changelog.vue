<template>
  <div>
    <markdown-paging
      :pages='changelog'
      :selectedPage='page'
      placeholder='#### select a log on the left'
      :mdClass="'md-changelog'"
    ></markdown-paging>
  </div>
</template>

<script lang="ts" src='./changelog.ts'></script>
<style lang='sass' src='@/styles/markdown/_md_changelog.sass'></style>
