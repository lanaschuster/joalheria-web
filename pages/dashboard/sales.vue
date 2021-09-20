<template>
  <v-container>
    <Sales v-if="canAccess" />
    <Forbidden v-else />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { auth } from '@/store'
import { Module, Action } from '@/models'
import { Forbidden, Sales } from '@/components/organisms'

export default Vue.extend({
  layout: 'dashboard',
  middleware: 'guard',
  components: {
    Forbidden,
    Sales
  },
  computed: {
    canAccess() {
      const permissions = auth.$permissions
      return permissions.find(p => {
        return p.module === Module.SALES &&
          (p.action === Action.ALL || p.action === Action.READ)
      })
    }
  },
})
</script>

<style lang="scss" scoped>
</style>
