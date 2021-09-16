<template>
  <v-container>
    <MeuPerfil />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { MeuPerfil } from '@/components/organisms'

export default Vue.extend({
  layout: 'dashboard',
  components: {
    MeuPerfil
  },
  middleware: 'guard',
})
</script>

<style lang="scss" scoped>
</style>
