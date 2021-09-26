<template>
  <form @submit.prevent="onSubmit">
    <v-row>
      <v-col cols="12" sm="12" md="4">
        <v-text-field
          outlined
          required
          :readonly="isViewMode"
          color="primary"
          type="text"
          label="Customer name"
          v-model="form.clientName"
          placeholder="Customer name"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="4">
        <v-text-field
          outlined
          :readonly="isViewMode"
          color="primary"
          type="email"
          label="Customer e-mail"
          v-model="form.clientEmail"
          placeholder="Customer e-mail"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12" md="4">
        <v-select
          outlined
          required
          :disabled="isViewMode"
          color="primary"
          :items="categories"
          v-model="category"
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
        <v-autocomplete
          v-model="product"
          :items="products"
          :loading="isLoading"
          :search-input.sync="search"
          color="white"
          hide-no-data
          hide-selected
          item-text="Description"
          item-value="API"
          label="Public APIs"
          placeholder="Start typing to Search"
          prepend-icon="mdi-database-search"
          return-object
        ></v-autocomplete>
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
import { Mode, Sale, SaleStatus, DiscountType } from '@/models'

export default Vue.extend({
  props: {
    id: {
      type: Number,
    },
  },
  data() {
    return {
      loading: false,
      productLoading: false,
      form: {} as Sale,
      category: {},
      categories: [],
      product: {},
      products: [],
    }
  },
  computed: {
    isViewMode(): boolean {
      return screen.$mode === Mode.VIEW
    },
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
    findCategories() {
      this.loading = true
      $axios
        .$get(`/api/categories/all`)
        .then((r) => {
          this.loading = false
          this.categories = r
        })
        .catch((error) => {
          this.loading = false
        })
    },
  },
  created() {
    if (this.id) {
      this.find()
    }

    this.findCategories()
  },
})
</script>

<style lang="scss" scoped>
</style>
