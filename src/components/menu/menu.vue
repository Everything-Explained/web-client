<template>
  <menu ref='menu' class="main__menu" :class="{ '--opened': opened }">
    <header class="menu__header">
      <div class="menu-header_ribbon"></div>
      <span class="menu-header_text">MENU</span>
      <icon
        class='menu-header_exit-icon'
        :type='"cross"'
        @mousedown="closeMenu"
      ></icon>
    </header>
    <ul>
      <li class="menu_item" v-for="(route, i) of routes" :key="i" @click="closeMenu">
        <router-link :to="route.path">{{ route.name }}</router-link>
      </li>
    </ul>
  </menu>
</template>


<script lang='ts'  src='./_menu.ts' ></script>