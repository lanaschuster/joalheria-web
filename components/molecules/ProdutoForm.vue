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
      </v-row>
      <v-row>
        <v-col cols="12" sm="12" md="2">
          <v-text-field
            outlined
            :readonly="isViewMode"
            color="primary"
            type="text"
            label="Code"
            v-model="form.code"
            placeholder="Code"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="2">
          <v-text-field
            outlined
            :readonly="isViewMode"
            color="primary"
            type="text"
            label="SKU"
            v-model="form.sku"
            placeholder="SKU"
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
            v-model="form.provider"
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

        <v-col cols="12" sm="12" md="2">
          <v-text-field
            outlined
            :readonly="isViewMode"
            color="primary"
            type="number"
            min="0"
            step="0.01"
            label="Unit cost"
            v-model="form.unitCost"
            placeholder="Unit cost"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="2">
          <v-text-field
            outlined
            :readonly="isViewMode"
            color="primary"
            type="number"
            min="0"
            step="1"
            label="Quantity"
            v-model="form.quantity"
            placeholder="Quantity"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="2">
          <v-text-field
            outlined
            :readonly="isViewMode"
            color="primary"
            type="number"
            min="0"
            step="0.01"
            label="Shipping cost"
            v-model="form.shipCost"
            placeholder="Shipping cost"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="2">
          <v-text-field
            outlined
            :readonly="isViewMode"
            color="primary"
            type="number"
            min="0"
            step="0.01"
            label="Total cost"
            v-model="form.totalCost"
            placeholder="Total cost"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="2">
          <v-text-field
            outlined
            :readonly="isViewMode"
            color="primary"
            type="number"
            min="0"
            step="0.01"
            label="Sale price"
            v-model="form.price"
            placeholder="Sale price"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="2">
          <v-text-field
            outlined
            :readonly="isViewMode"
            color="primary"
            type="number"
            min="0"
            step="0.01"
            label="Profit"
            v-model="profit"
            placeholder="Profit"
          ></v-text-field>
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
import { Mode, Produto, Fornecedor, Categoria } from '@/models'
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
        provider: {} as Fornecedor,
        category: {} as Categoria,
      } as Produto,
      profit: 0,
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
      if (screen.$mode === Mode.ADD) {
        this.cadastrar()
      } else if (screen.$mode === Mode.EDIT) {
        this.alterar()
      }
    },
    cadastrar() {
      this.loading = true

      let produto = { ...this.form }
      produto.categoryId = produto.category.id
      produto.providerId = produto.provider.id

      $axios.$post(`/api/products`, produto)
        .then(r => {
          this.loading = false
          this.voltar()
          snackbar.setMessage('Produto cadastrado com sucesso')
          snackbar.setSnackbar(true)
        })
        .catch(error => {
          this.loading = false
          if (error.response && error.response.data) {
            snackbar.setMessage(error.response.data.message)
          } else {
            snackbar.setMessage(
              'Não foi possível cadastrar o produto.'
            )
          }

          snackbar.setSnackbar(true)
        })
    },
    alterar() {
      this.loading = true

      let produto = { ...this.form }
      produto.categoryId = produto.category.id
      produto.providerId = produto.provider.id

      $axios.$put(`/api/products/${this.id}`, produto)
        .then(r => {
          this.loading = false
          this.voltar()
          snackbar.setMessage('Produto editado com sucesso')
          snackbar.setSnackbar(true)
        })
        .catch(error => {
          this.loading = false
          if (error.response && error.response.data) {
            snackbar.setMessage(error.response.data.message)
          } else {
            snackbar.setMessage(
              'Não foi possível editar o produto.'
            )
          }

          snackbar.setSnackbar(true)
        })
    },
    find() {
      this.loading = true
      $axios.$get(`/api/products/${this.id}`)
        .then(r => {
          this.loading = false
          this.form = r
        })
        .catch(error => {
          this.loading = false
          if (error.response && error.response.data) {
            snackbar.setMessage(error.response.data.error)
          } else {
            snackbar.setMessage(
              'Não foi possível consultar o produto selecionado.'
            )
          }

          snackbar.setSnackbar(true)
        })
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
