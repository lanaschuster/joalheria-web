<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      clipped
      :mini-variant="miniVariant"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          nuxt
          :to="item.to"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <v-list-item @click="logout">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              <span class="sidebar-menu-item">Logout</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-navigation-drawer>
    <v-app-bar
      clipped-left
      color="primary"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title>
        {{ title }}
        <v-icon>mdi-diamond-stone</v-icon>
      </v-toolbar-title>
      <v-spacer />
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <!-- <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer> -->
    <Snackbar />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { auth } from '@/store'
import { Snackbar } from '@/components/molecules'

export default Vue.extend({
  middleware: 'guard',
  components: {
    Snackbar
  },
  data () {
    return {
      drawer: true,
      fixed: false,
      items: [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: 'home'
        },
        {
          icon: 'mdi-account-circle',
          title: 'My Account',
          to: 'my-account'
        },
        {
          icon: 'mdi-store',
          title: 'Suppliers',
          to: 'suppliers'
        },
        {
          icon: 'mdi-ring',
          title: 'Products',
          to: 'products'
        },
        {
          icon: 'mdi-label-multiple',
          title: 'Categories',
          to: 'categories'
        },
        {
          icon: 'mdi-account',
          title: 'Users',
          to: 'users'
        },
        {
          icon: 'mdi-card-account-details-star',
          title: 'Permissions',
          to: 'permissions'
        }
      ],
      miniVariant: false,
      title: 'D\'alma & Grace Jewellery'
    }
  },
  methods: {
    logout() {
      auth.logout()
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
