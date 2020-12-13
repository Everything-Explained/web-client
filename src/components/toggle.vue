<template>
  <fieldset>
    <legend>{{ legend }}</legend>
    <div class="toggle">
      <input type="radio" name="sizeBy" value="weight" id="sizeWeight" checked="checked" />
      <label @click="toggle(false)" for="sizeWeight">{{ leftText }}</label>
      <input type="radio" name="sizeBy" value="dimensions" id="sizeDimensions" />
      <label @click="toggle(true)" for="sizeDimensions">{{ rightText }}</label>
    </div>
  </fieldset>
</template>

<script lang="ts" src='./toggle.ts'></script>