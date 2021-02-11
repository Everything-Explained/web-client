<template>
  <menu ref='menu' class="app-menu" :class="{ '--opened': opened }">
    <header class="app-menu__header">
      <span class="app-menu__header_text">Menu</span>
      <icon class='app-menu__header_exit-icon'
        :type='"cross"'
        @mousedown="closeMenu"
      ></icon>
    </header>
    <ul>
      <template v-for="(map, i) of routeMap" :key="i">
        <li v-if="map.name != 'root' && !map.hidden" class="app-menu_category">{{ map.name }}</li>
        <li class="app-menu_item"
          v-for="(route, i) of map.routes" :key="i"
          @click="closeMenu"
        >
          <router-link :to='route.path'>{{ route.title }}</router-link>
        </li>
      </template>
    </ul>
  </menu>
</template>



<script lang='ts' src='./menu'></script>