<template>
  <form @submit.prevent="onSubmit">
    <v-row>
      <v-col cols="12" sm="12" md="6">
        <v-text-field
          outlined
          :readonly="isViewMode"
          color="primary"
          type="text"
          label="Customer name"
          v-model="form.clientName"
          placeholder="Customer name"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="12"></v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <v-btn outlined color="primary" @click="voltar">Voltar</v-btn>
        <v-btn
          type="submit"
          v-if="!isViewMode"
          color="primary"
          :loading="loading"
        >
          Salvar
        </v-btn>
      </v-col>
    </v-row>
  </form>
</template>

<script lang="ts">
import Vue from 'vue'
import { $axios } from '@/utils/nuxt-instance'
import { screen, snackbar } from '@/utils/store-access'
import { MoneyFormat } from '@/mixins'
import {
  Mode,
  Sale,
  SaleStatus,
  DiscountType
} from '@/models'

export default Vue.extend({
  props: {
    id: {
      type: Number,
    },
  },
  data() {
    return {
      loading: false,
      form: {} as Sale
    }
  },
  computed: {
    isViewMode(): boolean {
      return screen.$mode === Mode.VIEW
    }
  },
  methods: {
    onSubmit() {
      if (screen.$mode === Mode.ADD) {
        this.cadastrar()
      }
    },
    find() {
      // TODO
    },
    cadastrar() {
      // TODO
    },
    voltar() {
      this.$emit('id', undefined)
      screen.setMode(Mode.LIST)
    },
  },
  created() {
    if (this.id) {
      this.find()
    }
  },
})
</script>

<style lang="scss" scoped>
</style>
