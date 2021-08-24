<template>
  <v-row>
    <v-col cols="12" sm="12" md="3">
      <v-text-field
        label="Search"
        color="secondary"
        v-model="options.filter"
        placeholder="Type to search by description or code"
      ></v-text-field>
    </v-col>
    <v-col 
      cols="12" sm="12" md="9" 
      class="d-flex align-center justify-end">
      <v-btn @click="add" color="success">
        New Product
      </v-btn>
    </v-col>
    <v-col cols="12" sm="12" md="12">
      <v-data-table
        no-data-text="Nenhum produto cadastrado."
        :headers="headers"
        :items="products"
        :server-items-length="options.totalItems"
        :loading="loading"
        :options.sync="options"
        loading-text="Fetching products..."
      ></v-data-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { $axios } from '@/utils/nuxt-instance'
import { screen, snackbar } from '@/utils/store-access'
import { Mode } from '@/models'


export default Vue.extend({
  data() {
    return {
      options: {
        filter: '',
        pageCount: 0,
        page: 1,
        itemsPerPage: 10,
        totalItems: 0
      },
      loading: false,
      products: [],
      headers: [
        {
          text: 'Id',
          sortable: true,
          align: 'start',
          value: 'id',
        },
        {
          text: 'Code',
          sortable: true,
          align: 'start',
          value: 'code',
        },
        {
          text: 'Name',
          sortable: true,
          align: 'start',
          value: 'name',
        },
        {
          text: 'Supplier',
          sortable: true,
          align: 'start',
          value: 'provider.name',
        },
        {
          text: 'Category',
          sortable: true,
          align: 'start',
          value: 'category.name',
        },
        {
          text: 'Price',
          sortable: true,
          align: 'start',
          value: 'price',
        },
        {
          text: 'Quantity',
          sortable: true,
          align: 'start'
        },
        {
          text: 'Profit',
          sortable: true,
          align: 'start',
          value: 'profit',
        },
        {
          text: 'Opções',
          sortable: false,
          align: 'center',
          value: 'action',
        },
      ],
    }
  },
  watch: {
    isListMode: function(val) {
      if (val) {
        this.find()
      }
    },
    options: {
      handler() {
        this.find()
      },
      deep: true
    }
  },
  computed: {
    isListMode() {
      return screen.$mode === Mode.LIST
    }
  },
  methods: {
    find() {
      this.loading = true
      
      const filter = this.options.filter
      const size = this.options.itemsPerPage > -1
        ? this.options.itemsPerPage 
        : this.options.totalItems

      let url = `/api/products?page=${this.options.page}&size=${size}`
      
      if (filter) {
        url = `${url}&filter=${filter}`
      }

      $axios.$get(url)
        .then(r => {
          this.loading = false
          this.products = r.result
          this.options.pageCount = r.pages
          this.options.totalItems = r.count
        })
        .catch(error => {
          this.loading = false
          if (error.response && error.response.data) {
            snackbar.setMessage(error.response.data.error)
          } else {
            snackbar.setMessage(
              'Não foi possível consultar os produtos, tente mais tarde.'
            )
          }

          snackbar.setSnackbar(true)
        })
    },
    visualizar(id: number) {
      screen.setMode(Mode.VIEW)
      this.$emit('id', id)
    },
    editar(id: number) {
      screen.setMode(Mode.EDIT)
      this.$emit('id', id)
    },
    excluir(id: number) {
      screen.setMode(Mode.DELETE)
      this.$emit('id', id)
    },
    add() {
      screen.setMode(Mode.ADD)
    }
  },
  mounted() {
    if (screen.$mode === Mode.LIST) {
      this.find()
    }
  },
  created() {
    screen.setMode(Mode.LIST)
  }
})
</script>

<style lang="scss" scoped>
</style>
