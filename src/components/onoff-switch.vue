<template>
  <div class="onoff-switch input-switch" @click="toggle()">
    <input type="checkbox" :checked="state" />
    <span class="switch-text-off">OFF</span>
    <span class="slider"></span>
    <span class="switch-text-on">ON</span>
  </div>
</template>

<script lang="ts" src='./onoff-switch.ts'></script>