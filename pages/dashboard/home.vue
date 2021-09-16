<template>
  <v-container>
    <Inicio />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Inicio } from '@/components/organisms'

export default Vue.extend({
  layout: 'dashboard',
  components: {
    Inicio
  },
  middleware: 'guard',
})
</script>

<style lang="scss" scoped>
</style>
