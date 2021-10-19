<template>
  <div class="component">
    <h1 class="title text-h4 mb-2 fw-500">{{ title }}</h1>
    <h4 class="subtitle text-subtitle-1 mb-8">{{ subtitle }}</h4>
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
import { Mode } from '@/models'
import { SaleList, SaleForm } from '@/components/molecules'
import { screen } from '@/store'

export default Vue.extend({
  components: {
    SaleList,
    SaleForm,
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
    }
  },
  created() {
    screen.setMode(Mode.LIST)
  }
})
</script>

<style lang="scss" scoped>
</style>
