<template>
  <div class="component">
    <h1 class="title text-h4 mb-2">{{ title }}</h1>
    <h4 class="subtitle text-subtitle-1 mb-8">{{ subtitle }}</h4>
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <UsuarioList
          v-if="isListMode || isDeleteMode" 
          @id="id = $event" 
        />
        <UsuarioForm 
          v-else 
          :id="+id"
        />
      </v-col>
    </v-row>
    <UsuarioDeleteDialog
      :id="id ? +id : -1"
      :isActive="isDeleteMode"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Mode } from '@/models'
import { UsuarioList, UsuarioForm, UsuarioDeleteDialog } from '@/components/molecules'
import { screen } from '@/store'

export default Vue.extend({
  components: {
    UsuarioList,
    UsuarioForm,
    UsuarioDeleteDialog
  },
  data() {
    return {
      id: ''
    }
  },
  computed: {
    title(): string {
      if (screen.$mode === Mode.VIEW) {
        return `Visualizando usuário`
      } else if (screen.$mode === Mode.ADD) {
        return `Cadastrando novo usuário`
      } else if (screen.$mode === Mode.EDIT) {
        return `Editando usuário`
      } else {
        return 'Usuários'
      }
    },
    subtitle(): string {
      if (screen.$mode === Mode.VIEW) {
        return 'Usuário ID: ' + this.id
      } else if (screen.$mode === Mode.EDIT) {
        return `Editando usuário ID: ` + this.id
      } else {
        return 'Listagem de usuários'
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
