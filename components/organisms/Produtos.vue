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
        <ProdutoList
          v-if="isListMode || isDeleteMode" 
          @id="id = $event" 
        />
        <ProdutoForm 
          v-else 
          @id="id = $event" 
          :id="+id"
        />
      </v-col>
    </v-row>
    <ProdutoDeleteDialog
      :id="id ? +id : -1"
      :isActive="isDeleteMode"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Mode, Module, Action } from '@/models'
import { ProdutoList, ProdutoForm, ProdutoDeleteDialog, CrudHeader } from '@/components/molecules'
import { screen, auth } from '@/store'

export default Vue.extend({
  components: {
    ProdutoList,
    ProdutoForm,
    ProdutoDeleteDialog,
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
        return `Viewing Jewel`
      } else if (screen.$mode === Mode.ADD) {
        return `Registering new Jewel`
      } else if (screen.$mode === Mode.EDIT) {
        return `Editing Jewel`
      } else {
        return 'Jewels'
      }
    },
    subtitle(): string {
      if (screen.$mode === Mode.VIEW) {
        return 'Jewel ID: ' + this.id
      } else if (screen.$mode === Mode.EDIT) {
        return `Editing Jewel ID: ` + this.id
      } else if (screen.$mode === Mode.LIST) {
        return 'Registered Jewels'
      } else if (screen.$mode === Mode.ADD) {
        return 'Select an image and fill in the fields correctly.'
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
        return p.module === Module.PRODUCTS &&
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
