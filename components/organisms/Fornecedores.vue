<template>
  <div class="component">
    <h1 class="title text-h4 mb-2">{{ title }}</h1>
    <h4 class="subtitle text-subtitle-1 mb-8">{{ subtitle }}</h4>
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <FornecedorList
          v-if="isListMode || isDeleteMode" 
          @id="id = $event" 
        />
        <FornecedorForm 
          v-else 
          @id="id = $event"
          :id="+id"
        />
      </v-col>
    </v-row>
    <FornecedorDeleteDialog
      :id="id ? +id : -1"
      :isActive="isDeleteMode"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Mode } from '@/models'
import { 
  FornecedorList, 
  FornecedorForm, 
  FornecedorDeleteDialog 
} from '@/components/molecules'
import { screen } from '@/store'

export default Vue.extend({
  components: {
    FornecedorList,
    FornecedorForm,
    FornecedorDeleteDialog
  },
  data() {
    return {
      id: ''
    }
  },
  computed: {
    title(): string {
      if (screen.$mode === Mode.VIEW) {
        return `Visualizando fornecedor`
      } else if (screen.$mode === Mode.ADD) {
        return `Cadastrando novo fornecedor`
      } else if (screen.$mode === Mode.EDIT) {
        return `Editando fornecedor`
      } else {
        return 'Fornecedores'
      }
    },
    subtitle(): string {
      if (screen.$mode === Mode.VIEW) {
        return 'Fornecedor ID: ' + this.id
      } else if (screen.$mode === Mode.EDIT) {
        return `Editando fornecedor ID: ` + this.id
      } else if (screen.$mode === Mode.LIST) {
        return 'Listagem de fornecedores'
      }

      return ''
    },
    isDeleteMode() {
      return screen.$mode === Mode.DELETE
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
