<template>
  <v-container>
    <Permissoes v-if="canAccessPermissoes" />
    <Forbidden v-else />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { auth } from '@/store'
import { Module, Action } from '@/models'
import { Permissoes, Forbidden } from '@/components/organisms'

export default Vue.extend({
  layout: 'dashboard',
  components: {
    Permissoes,
    Forbidden
  },
  computed: {
    canAccessPermissoes() {
      const permissions = auth.$permissions
      return permissions.find(p => {
        return p.module === Module.ROLES &&
          (p.action === Action.ALL || p.action === Action.READ)
      })
    }
  },
  middleware: 'guard',
})
</script>

<style lang="scss" scoped>
</style>
