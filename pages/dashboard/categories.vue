<template>
  <v-container>
    <Categorias v-if="canAccessCategory"  />
    <Forbidden v-else />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { auth } from '@/store'
import { Module, Action } from '@/models'
import { Categorias, Forbidden } from '@/components/organisms'

export default Vue.extend({
  layout: 'dashboard',
  components: {
    Categorias,
    Forbidden
  },
  computed: {
    canAccessCategory() {
      const permissions = auth.$permissions
      return permissions.find(p => {
        return p.module === Module.CATEGORIES &&
          (p.action === Action.ALL || p.action === Action.READ)
      })
    }
  },
  middleware: 'guard',
})
</script>

<style lang="scss" scoped>
</style>
