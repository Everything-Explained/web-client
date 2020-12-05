<template>
  <menu ref='menu' class="app-menu" :class="{ '--opened': opened }">
    <header class="app-menu__header">
      <div class="app-menu__header_ribbon"></div>
      <span class="app-menu__header_text">MENU</span>
      <icon
        class='app-menu__header_exit-icon'
        :type='"cross"'
        @mousedown="closeMenu"
      ></icon>
    </header>
    <ul>
      <li class="app-menu_item" v-for="(route, i) of routes" :key="i" @click="closeMenu">
        <router-link :to="route.path">{{ route.name }}</router-link>
      </li>
    </ul>
  </menu>
</template>


<script lang='ts'  src='./menu.ts' ></script>