<template>
  <div class="component">
    <h1 class="title text-h4 mb-2">{{ title }}</h1>
    <h4 class="subtitle text-subtitle-1 mb-8">{{ subtitle }}</h4>
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <SaleList
          v-if="isListMode" 
          @id="id = $event" 
        />
        <UsuarioForm 
          @id="id = $event" 
          v-else 
          :id="+id"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Mode } from '@/models'
import { SaleList, UsuarioForm } from '@/components/molecules'
import { screen } from '@/store'

export default Vue.extend({
  components: {
    SaleList,
    UsuarioForm,
  },
  data() {
    return {
      id: ''
    }
  },
  computed: {
    title(): string {
      if (screen.$mode === Mode.VIEW) {
        return `Visualizando venda`
      } else if (screen.$mode === Mode.ADD) {
        return `Cadastrando nova venda`
      } else {
        return 'Sales'
      }
    },
    subtitle(): string {
      if (screen.$mode === Mode.VIEW) {
        return 'Venda ID: ' + this.id
      } else {
        return 'Listagem das vendas realizadas'
      }

      return ''
    },
    isListMode() {
      return screen.$mode === Mode.LIST
    }
  },
  created() {
    screen.setMode(Mode.LIST)
  }
})
</script>

<style lang="scss" scoped>
</style>
