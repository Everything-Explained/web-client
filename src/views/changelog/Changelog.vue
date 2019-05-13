<template>
  <div>
    <markdown-paging
      :pages='changelog'
      :selectedPage='page'
      placeholder='#### SELECT A LOG ON THE LEFT'
      :mdClass="'md-changelog'"
      sortBy="dateLast"
    ></markdown-paging>
  </div>
</template>

<script lang="ts" src='./_changelog.ts'></script>
<style lang='sass' src='@/styles/markdown/_md_changelog.sass'></style>
