<template>
  <v-container>
    <Produtos v-if="canAccessProducts" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { auth } from '@/store'
import { Module, Action } from '@/models'
import { Produtos } from '@/components/organisms'

export default Vue.extend({
  layout: 'dashboard',
  components: {
    Produtos
  },
  computed: {
    canAccessProducts() {
      const permissions = auth.$permissions
      return permissions.find(p => {
        return p.module === Module.PRODUCTS &&
          (p.action === Action.ALL || p.action === Action.READ)
      })
    }
  },
  middleware: 'guard',
})
</script>

<style lang="scss" scoped>
</style>
