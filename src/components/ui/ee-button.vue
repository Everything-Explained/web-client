<template>
  <button :class='["ee-btn", type, { "--loading": loading }]'
    type="submit"
    :disabled='disabled'
  ><slot></slot></button>
</template>



<script src='./ee-button' lang='ts'></script>