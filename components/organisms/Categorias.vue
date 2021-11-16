<template>
  <div class="component">
    <CrudHeader
      :title="title"
      :subtitle="subtitle"
      :isListMode="isListMode"
      :canAdd="true"
      @add="add"
    />
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <CategoriaList
          v-if="isListMode || isDeleteMode" 
          @id="id = $event" 
        />
        <CategoriaForm 
          v-else 
          @id="id = $event"
          :id="+id"
        />
      </v-col>
    </v-row>
    <CategoriaDeleteDialog
      :id="id ? +id : -1"
      :isActive="isDeleteMode"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Mode } from '@/models'
import { 
  CategoriaList,
  CategoriaForm,
  CategoriaDeleteDialog,
  CrudHeader
} from '@/components/molecules'
import { screen } from '@/store'

export default Vue.extend({
  components: {
    CategoriaList,
    CategoriaForm,
    CategoriaDeleteDialog,
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
        return `Viewing Category`
      } else if (screen.$mode === Mode.ADD) {
        return `Registering new Category`
      } else if (screen.$mode === Mode.EDIT) {
        return `Editing Category`
      } else {
        return 'Categories'
      }
    },
    subtitle(): string {
      if (screen.$mode === Mode.VIEW) {
        return 'Category ID: ' + this.id
      } else if (screen.$mode === Mode.EDIT) {
        return `Editing Category ID: ` + this.id
      } else if (screen.$mode === Mode.LIST) {
        return 'Registered Jewel Categories'
      }

      return ''
    },
    isDeleteMode() {
      return screen.$mode === Mode.DELETE
    },
    isListMode() {
      return screen.$mode === Mode.LIST
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
