<template>
  <div class=".nav" @mouseover="test">
    <router-link class=".nav__link" to="/">Home</router-link> |
    <router-link class=".nav__link" to="/about">About</router-link>
  </div>
  <router-view/>
</template>

<script lang="ts" src="./_app.ts"></script>
