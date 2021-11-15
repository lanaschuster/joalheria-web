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
      <template v-slot:prepend>
        <v-list-item :class="{'pl-0': miniVariant, 'pr-0': miniVariant, 'pt-4': true}">
          <v-list-item-content>
            <v-avatar :height="miniVariant ? '40' : '180'">
              <v-img
                :height="miniVariant ? '40' : '180'"
                :width="miniVariant ? '40' : '180'"
                lazy-src="/img/logo.jpg"
                style="position: absolute"
                :src="imagePreview"
                alt="Avatar"
              ></v-img>
            </v-avatar>
            <p 
              v-if="!miniVariant"
              style="font-weight: 500;"
              class="text-center mt-4" 
            >
              Hello, {{ user.name }}
            </p>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
      </template>
      <template v-slot:append>
        <v-divider></v-divider>
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
        v-if="!isMobile"
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title>
        {{ title }}
      </v-toolbar-title>
      <v-spacer />
    </v-app-bar>
    <v-main style="background-color: #F7F7F7">
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
import { $axios } from '@/utils/nuxt-instance'

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
      title: 'D\'alma & Grace Jewellery',
      user: {
        role: {
          name: '',
        },
        name: '',
        lastName: '',
        email: '',
        avatar: '/img/image.svg'
      },
      imagePreview: '/img/logo.jpg',
    }
  },
  computed: {
    menus(): Array<any> {
      let mainMenu: Array<any> = [
        {
          icon: 'mdi-view-dashboard',
          title: 'Dashboard',
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
      const readSales = this.canReadMenu(permissions, Module.SALES)
    
      if (readSuppliers) {
        mainMenu.push({
          icon: 'mdi-store',
          title: 'Suppliers',
          to: 'suppliers'
        })
      }

      if (readUsers) {
        mainMenu.push({
          icon: 'mdi-account-group',
          title: 'Users',
          to: 'users'
        })
      }

      if (readProducts) {
        mainMenu.push({
          icon: 'mdi-ring',
          title: 'Jewels',
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

      if (readSales) {
        mainMenu.push({
          icon: 'mdi-cash-register',
          title: 'Sales',
          to: 'sales'
        })
      }

      return mainMenu
    },
    isMobile(): boolean {
      switch ((this as any).$vuetify.breakpoint.name) {
        case 'xs':
          return true
        case 'sm':
          return true
        default:
          return false
      }
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
    },
    find() {
      $axios
        .$get(`/api/users/myself`)
        .then((r) => {
          this.user = r.user
          if (this.user.avatar) {
            this.user.avatar = `${process.env.apiUrl}/${this.user.avatar}`
            this.imagePreview = this.user.avatar
          }
        })
    },
  },
  created() {
    this.find()
  }
})
</script>

<style lang="scss" scoped>
@media screen and (min-width: 301px) and (max-width: 1056px){
  ::v-deep .container {
    padding: 6px;
    margin: 6px;
  }
}
@media screen and (max-width: 300px) {
  ::v-deep .container {
    padding: 6px;
  }
}
</style>
