<template>
  <div>
    <markdown-paging
      :pages='faq'
      :selectedPage='page'
      placeholder='#### SELECT A QUESTION ON THE LEFT'
      :mdClass="'md-faq'"
    ></markdown-paging>
  </div>
</template>


<script lang="ts" src='./_faq.ts'></script>
<style lang='sass' src='../../styles/markdown/_md_faq.sass'></style>