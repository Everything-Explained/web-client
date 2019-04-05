<template>
  <div class="settings-page">
    <img :src="picture" alt="" width="96" height="96" />
    <div>
      <div class="row">
        <div class="cell">alias</div>
        <div class="cell">{{alias}}</div>
      </div>
      <div class="row">
        <div class="cell">email</div>
        <div class="cell">{{email}}</div>
      </div>
      <button class="standard" @click="logout">Logout</button>
    </div>

    <!-- <auth-input
      :min="4"
      :max="20"
      :test1="(input) => /^[a-zA-Z0-9]+$/.test(input)"
      :test2="(input) => !/([a-zA-Z0-9])\1{2,}/.test(input)"
      :validate="validateAlias"
      :validationDelay="600"
      validationType="Alias"
      @valid-input="(valias) => alias = valias"
    >
      <template v-slot:invalid1>Allowed: 0-9, a-z, or A-Z</template>
      <template v-slot:invalid2>Repeat Characters Detected</template>
      <template v-slot:valid>Alias Available!</template>
      Enter an Alias
    </auth-input> -->

  </div>
</template>


<script lang='ts' src='./_settings.ts'></script>
<style lang='sass' src='./_settings.sass'></style>

