<template>
  <div class="title-bar">
    <icon class="title-bar__menu-icon"
      @mousedown="openMenu"
      :class="{ '--menu-open': isMenuOpen }" :type='"menu"'
    ></icon>
    <transition
      name="fade" :duration="{ enter, leave }" mode="out-in"
    >
      <div class="title-bar__text" :key="title">{{title}}</div>
    </transition>
  </div>
</template>



<script lang='ts' src='./titlebar'></script>