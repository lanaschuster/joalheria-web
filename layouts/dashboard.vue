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
          v-for="(item, i) in menus"
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
import { Module, Action } from '@/models'

export default Vue.extend({
  middleware: 'guard',
  components: {
    Snackbar
  },
  data () {
    return {
      drawer: true,
      fixed: false,
      miniVariant: false,
      title: 'D\'alma & Grace Jewellery'
    }
  },
  computed: {
    menus(): Array<any> {
      let mainMenu: Array<any> = [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: 'home'
        },
        {
          icon: 'mdi-account-circle',
          title: 'My Account',
          to: 'profile'
        }
      ]

      const permissions = auth.$permissions
      const readSuppliers = this.canReadMenu(permissions, Module.PROVIDERS)
      const readUsers = this.canReadMenu(permissions, Module.USERS)
      const readProducts = this.canReadMenu(permissions, Module.PRODUCTS)
      const readCategories = this.canReadMenu(permissions, Module.CATEGORIES)
      const readPermissions = this.canReadMenu(permissions, Module.ROLES)
    
      if (readSuppliers) {
        mainMenu.push({
          icon: 'mdi-store',
          title: 'Suppliers',
          to: 'suppliers'
        })
      }

      if (readUsers) {
        mainMenu.push({
          icon: 'mdi-account',
          title: 'Users',
          to: 'users'
        })
      }

      if (readProducts) {
        mainMenu.push({
          icon: 'mdi-ring',
          title: 'Products',
          to: 'products'
        })
      }

      if (readCategories) {
        mainMenu.push({
          icon: 'mdi-label-multiple',
          title: 'Categories',
          to: 'categories'
        })
      }

      if (readPermissions) {
        mainMenu.push({
          icon: 'mdi-card-account-details-star',
          title: 'Permissions',
          to: 'permissions'
        })
      }

      return mainMenu
    }
  },
  methods: {
    canReadMenu(permissions: Array<any>, moduleName: Module) {
      return permissions.find(p => {
        return p.module === moduleName &&
          (p.action === Action.ALL || p.action === Action.READ)
      })
    },
    logout() {
      auth.logout()
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
