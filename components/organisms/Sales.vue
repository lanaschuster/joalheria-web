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
        <SaleList
          v-if="isListMode" 
          @id="id = $event" 
        />
        <SaleForm 
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
import { Mode, Module, Action } from '@/models'
import { SaleList, SaleForm, CrudHeader } from '@/components/molecules'
import { screen, auth } from '@/store'

export default Vue.extend({
  components: {
    SaleList,
    SaleForm,
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
        return `Viewing Sale Order`
      } else if (screen.$mode === Mode.ADD) {
        return `Registering new Sale Order`
      } else {
        return 'Sales'
      }
    },
    subtitle(): string {
      if (screen.$mode === Mode.VIEW) {
        return 'Sale Order ID: ' + this.id
      } else if (screen.$mode === Mode.LIST) {
        return 'Registered sales'
      }

      return ''
    },
    isListMode() {
      return screen.$mode === Mode.LIST
    },
    canAdd() {
      const permissions = auth.$permissions
      return permissions.find((p) => {
        return (
          p.module === Module.USERS &&
          (p.action === Action.ALL || p.action === Action.WRITE)
        )
      })
    },
  },
  methods: {
    add() {
      screen.setMode(Mode.ADD)
    }
  },
  created() {
    screen.setMode(Mode.LIST)
  }
})
</script>

<style lang="scss" scoped>
</style>
