<template>
  <fieldset>
    <legend>{{ legend }}</legend>
    <div class="toggle">
      <input
        type="radio"
        name="toggle"
        id="toggleLeft"
        checked="checked"
        :disabled='props.prevent'
      />
      <label
        :class="{ '--wait': props.prevent }"
        @click="toggle(false)"
        for="toggleLeft"
      >{{ leftText }}</label>
      <input
        type="radio"
        name="toggle"
        id="toggleRight"
        :disabled='props.prevent'
      />
      <label
        :class="{ '--wait': props.prevent }"
        @click="toggle(true)"
        for="toggleRight"
      >{{ rightText }}</label>
    </div>
  </fieldset>
</template>

<script lang="ts" src='./toggle'></script>