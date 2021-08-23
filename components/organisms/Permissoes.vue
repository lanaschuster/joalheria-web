<template>
  <div class="component">
    <h1 class="title text-h4 mb-2">{{ title }}</h1>
    <h4 class="subtitle text-subtitle-1 mb-8">{{ subtitle }}</h4>
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <PermissaoList
          v-if="isListMode || isDeleteMode"
          @id="id = $event"
        />
        <PermissaoForm
          v-else 
          :id="+id"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { screen } from '@/store'
import { Mode } from '@/models'
import { PermissaoList, PermissaoForm } from '@/components/molecules'

export default Vue.extend({
  components: {
    PermissaoList,
    PermissaoForm
  },
  data() {
    return {
      id: ''
    }
  },
  computed: {
    title(): string {
      if (screen.$mode === Mode.VIEW) {
        return `Visualizando permissão`
      } else if (screen.$mode === Mode.ADD) {
        return `Cadastrando nova permissão`
      } else if (screen.$mode === Mode.EDIT) {
        return `Editando permissão`
      } else {
        return 'Permissões'
      }
    },
    subtitle(): string {
      if (screen.$mode === Mode.VIEW) {
        return 'Permissão ID: ' + this.id
      } else if (screen.$mode === Mode.EDIT) {
        return `Editando permissão ID: ` + this.id
      } else {
        return 'Listagem dos perfis de permissões dos usuários'
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
