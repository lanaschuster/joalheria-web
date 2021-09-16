<template>
  <v-container>
    <Usuarios v-if="canAccessUsers" />
    <Forbidden v-else />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { auth } from '@/store'
import { Module, Action } from '@/models'

import {
  Usuarios,
  Forbidden
} from '@/components/organisms'

export default Vue.extend({
  layout: 'dashboard',
  components: {
    Usuarios,
    Forbidden
  },
  computed: {
    canAccessUsers() {
      const permissions = auth.$permissions
      return permissions.find(p => {
        return p.module === Module.USERS &&
          (p.action === Action.ALL || p.action === Action.READ)
      })
    }
  },
  middleware: 'guard',
})
</script>

<style lang="scss" scoped>
</style>
