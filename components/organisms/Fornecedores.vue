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
import { Mode, Module, Action } from '@/models'
import { 
  FornecedorList, 
  FornecedorForm, 
  FornecedorDeleteDialog,
  CrudHeader 
} from '@/components/molecules'
import { screen, auth } from '@/store'

export default Vue.extend({
  components: {
    FornecedorList,
    FornecedorForm,
    FornecedorDeleteDialog,
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
        return `Viewing supplier`
      } else if (screen.$mode === Mode.ADD) {
        return `Registering a new supplier`
      } else if (screen.$mode === Mode.EDIT) {
        return `Editing supplier`
      } else {
        return 'Suppliers'
      }
    },
    subtitle(): string {
      if (screen.$mode === Mode.VIEW) {
        return 'Supplier ID: ' + this.id
      } else if (screen.$mode === Mode.EDIT) {
        return `Editing supplier ID: ` + this.id
      } else if (screen.$mode === Mode.LIST) {
        return 'Registered suppliers'
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
        return p.module === Module.PROVIDERS &&
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
