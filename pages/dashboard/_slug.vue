<template>
  <v-container>
    <MeuPerfil v-if="slug === 'my-account'" />
    <Usuarios v-else-if="slug === 'users'" />
    <Permissoes v-else-if="slug === 'permissions'" />
    <Fornecedores v-else-if="slug === 'suppliers'" />
    <Inicio v-else />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Inicio, MeuPerfil, Usuarios, Permissoes, Fornecedores } from '@/components/organisms'

export default Vue.extend({
  layout: 'dashboard',
  components: {
    Inicio,
    MeuPerfil,
    Usuarios,
    Permissoes,
    Fornecedores
  },
  computed: {
    slug() {
      return this.$route.params.slug
    }
  },
  middleware: 'guard'
})
</script>

<style lang="scss" scoped>
</style>
