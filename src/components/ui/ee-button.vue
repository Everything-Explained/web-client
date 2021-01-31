<template>
  <button :class='["ee-btn", type, { "--loading": loading }]'
    :disabled='disabled'
  ><slot></slot></button>
</template>



<script src='./ee-button' lang='ts'></script>