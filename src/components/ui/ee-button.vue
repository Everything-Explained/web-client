<template>
  <button :class='["ee-btn", theme, { "--loading": loading }]'
    :type='undefined'
    :disabled='disabled'
  ><slot></slot></button>
</template>



<script src='./ee-button' lang='ts'></script>