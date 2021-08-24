<template>
    <form @submit.prevent="onSubmit">
      <v-row>
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            outlined
            :readonly="isViewMode"
            color="primary"
            type="text"
            label="Name"
            v-model="form.name"
            placeholder="Name"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="4">
          <v-select
            outlined
            :disabled="isViewMode"
            color="primary"
            :items="categories"
            v-model="form.category"
            label="Category"
          >
            <template #item="{ item }">
              <span class="primary--text">{{ item.name }}</span>
            </template>
            <template #selection="{ item }">
              {{ item.name }}
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" sm="12" md="4">
          <v-select
            outlined
            :disabled="isViewMode"
            color="primary"
            :items="suppliers"
            v-model="form.supplier"
            label="Supplier"
          >
            <template #item="{ item }">
              <span class="primary--text">{{ item.name }}</span>
            </template>
            <template #selection="{ item }">
              {{ item.name }}
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" sm="12" md="12">
          <v-textarea
            outlined
            :readonly="isViewMode"
            color="primary"
            type="text"
            label="Description"
            v-model="form.description"
            placeholder="Description"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="12" md="12">
          <v-btn outlined color="primary" @click="voltar">Voltar</v-btn>
          <v-btn type="submit" v-if="!isViewMode" color="primary">Salvar</v-btn>
        </v-col>
      </v-row>
    </form>
</template>

<script lang="ts">
import Vue from 'vue'
import { Mode } from '@/models'
import { $axios } from '@/utils/nuxt-instance'
import { screen, snackbar } from '@/utils/store-access'


export default Vue.extend({
  props: {
    id: {
      type: Number
    },
  },
  computed: {
    isViewMode() {
      return screen.$mode === Mode.VIEW
    }
  },
  data() {
    return {
      form: {
        name: '',
        description: '',
        code: '',
        image: '',
        quantity: 0,
        unitCost: 0.00,
        shipCost: 0,
        totalCost: 0,
        price: 0,
        profit: 0,
        supplier: {},
        category: {},
      },
      suppliers: [],
      categories: [],
      loading: false
    }
  },
  methods: {
    voltar() {
      screen.setMode(Mode.LIST)
    },
    onSubmit() {
      // TODO
    },
    find() {
      // TODO
    },
    findCategories() {
      this.loading = true
      $axios.$get(`/api/categories/all`)
        .then(r => {
          this.loading = false
          this.categories = r
        })
        .catch(error => {
          this.loading = false
          if (error.response && error.response.data) {
            snackbar.setMessage(error.response.data.error)
          } else {
            snackbar.setMessage(
              'Não foi possível consultar as categorias.'
            )
          }

          snackbar.setSnackbar(true)
        })
    },
    findSuppliers() {
      this.loading = true
      $axios.$get(`/api/providers/all`)
        .then(r => {
          this.loading = false
          this.suppliers = r
        })
        .catch(error => {
          this.loading = false
          if (error.response && error.response.data) {
            snackbar.setMessage(error.response.data.error)
          } else {
            snackbar.setMessage(
              'Não foi possível consultar as categorias.'
            )
          }

          snackbar.setSnackbar(true)
        })
    }
  },
  created() {
    if (this.id) {
      this.find()
    }

    this.findCategories()
    this.findSuppliers()
  }
})
</script>

<style lang="scss" scoped>
</style>
