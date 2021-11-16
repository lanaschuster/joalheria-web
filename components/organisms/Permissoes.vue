<template>
  <div class="component">
    <CrudHeader
      :title="title"
      :subtitle="subtitle"
      :isListMode="isListMode"
      :canAdd="canAdd"
      @add="add"
    />
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <PermissaoList
          v-if="isListMode || isDeleteMode"
          @id="id = $event"
        />
        <PermissaoForm
          v-else 
          @id="id = $event"
          :id="+id"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { screen, auth } from '@/store'
import { Mode, Module, Action } from '@/models'
import { PermissaoList, PermissaoForm, CrudHeader } from '@/components/molecules'

export default Vue.extend({
  components: {
    PermissaoList,
    PermissaoForm,
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
        return `Viewing Permission`
      } else if (screen.$mode === Mode.ADD) {
        return `Registering new Permission`
      } else if (screen.$mode === Mode.EDIT) {
        return `Editing Permission`
      } else {
        return 'Permissions'
      }
    },
    subtitle(): string {
      if (screen.$mode === Mode.VIEW) {
        return 'Permission ID: ' + this.id
      } else if (screen.$mode === Mode.EDIT) {
        return `Editing Permission ID: ` + this.id
      } else {
        return 'Registered user permissions'
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
        return p.module === Module.ROLES &&
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
