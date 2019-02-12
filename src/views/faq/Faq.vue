<template>
  <div>
    <markdown-paging
      :pages='faq'
      :selectedPage='page'
      placeholder='#### select a question on the left'
      :mdClass="'md-faq'"
    ></markdown-paging>
  </div>
</template>


<script lang="ts" src='./faq.ts'></script>
<style lang='sass' src='../../styles/markdown/_md_faq.sass'></style>