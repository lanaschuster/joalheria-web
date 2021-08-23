<template>
  <v-container>
    <MeuPerfil v-if="slug === 'meu-perfil'" />
    <Caixa v-else-if="slug === 'caixa'" />
    <Venda v-else-if="slug === 'venda'" />
    <Clientes v-else-if="slug === 'clientes'" />
    <Usuarios v-else-if="slug === 'usuarios'" />
    <Permissoes v-else-if="slug === 'permissoes'" />
    <Inicio v-else />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Inicio, Caixa, MeuPerfil, Venda, Clientes, Usuarios, Permissoes } from '@/components/organisms'

export default Vue.extend({
  layout: 'dashboard',
  components: {
    Inicio,
    MeuPerfil,
    Caixa,
    Venda,
    Clientes,
    Usuarios,
    Permissoes
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
