<template>
  <div class="component">
    <CrudHeader
      :title="title"
      :subtitle="subtitle"
      :isListMode="isListMode"
      :canAdd="canAdd"
      @add="add" />
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <UsuarioList
          v-if="isListMode || isDeleteMode" 
          @id="id = $event" 
        />
        <UsuarioForm 
          @id="id = $event" 
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
import { Mode, Module, Action } from '@/models'
import { UsuarioList, UsuarioForm, UsuarioDeleteDialog, CrudHeader } from '@/components/molecules'
import { screen, auth } from '@/store'

export default Vue.extend({
  components: {
    UsuarioList,
    UsuarioForm,
    UsuarioDeleteDialog,
    CrudHeader
  },
  data() {
    return {
      id: ''
    }
  },
  computed: {
    title(): string {
      if (screen.$mode === Mode.VIEW) {
        return `Viewing user`
      } else if (screen.$mode === Mode.ADD) {
        return `Registering new user`
      } else if (screen.$mode === Mode.EDIT) {
        return `Editing user`
      } else {
        return 'Users'
      }
    },
    subtitle(): string {
      if (screen.$mode === Mode.VIEW) {
        return 'User ID: ' + this.id
      } else if (screen.$mode === Mode.EDIT) {
        return `Editing user ID: ` + this.id
      } else if (screen.$mode === Mode.LIST) {
        return 'Registered users'
      }

      return ''
    },
    isDeleteMode() {
      return screen.$mode === Mode.DELETE
    },
    isListMode() {
      return screen.$mode === Mode.LIST
    },
    canAdd() {
      const permissions = auth.$permissions
      return permissions.find(p => {
        return p.module === Module.USERS &&
          (p.action === Action.ALL || p.action === Action.WRITE)
      })
    },
  },
  methods: {
    add() {
      screen.setMode(Mode.ADD)
    },
  },
  created() {
    screen.setMode(Mode.LIST)
  }
})
</script>

<style lang="scss" scoped>
</style>
