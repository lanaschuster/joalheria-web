<template>
  <v-container>
    <Fornecedores v-if="canAccessSuppliers" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { auth } from '@/store'
import { Module, Action } from '@/models'
import { Fornecedores } from '@/components/organisms'

export default Vue.extend({
  layout: 'dashboard',
  components: {
    Fornecedores
  },
  computed: {
    slug() {
      return this.$route.params.slug
    },
    canAccessSuppliers() {
      const permissions = auth.$permissions
      return permissions.find(p => {
        return p.module === Module.PROVIDERS &&
          (p.action === Action.ALL || p.action === Action.READ)
      })
    }
  },
  middleware: 'guard',
})
</script>

<style lang="scss" scoped>
</style>
