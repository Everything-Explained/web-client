<template>
  <div class="ee-input__container">
    <input class="ee-input__text"
      :id='id'
      :type="type"
      :maxlength="maxLength"
      placeholder="placeholder"
    >
    <label class="ee-input__label" :for='id'><slot></slot></label>
    <span class="ee-input__bar"></span>
  </div>
</template>


<script lang='ts' src='./ee-input-field.ts'></script>