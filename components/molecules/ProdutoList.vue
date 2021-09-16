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
      <v-btn @click="add" color="success" v-if="canAdd">
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
      >
        <template v-slot:[`item.action`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-on="on" v-bind="attrs" icon @click.stop="visualizar(item.id)">
                <v-icon> mdi-magnify </v-icon>
              </v-btn>
            </template>
            <span>Visualizar</span>
          </v-tooltip>

          <v-tooltip top v-if="canEdit">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-on="on" v-bind="attrs" icon @click.stop="editar(item.id)">
                <v-icon> mdi-pencil </v-icon>
              </v-btn>
            </template>
            <span>Editar</span>
          </v-tooltip>

          <v-tooltip top v-if="canDelete">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-on="on" v-bind="attrs" icon @click.stop="excluir(item.id)">
                <v-icon> mdi-delete </v-icon>
              </v-btn>
            </template>
            <span>Excluir</span>
          </v-tooltip>
        </template>
        <template v-slot:[`item.image`]="{ item }">
          <v-avatar size="100" class="mt-2 mb-2">
            <v-img
              height="100"
              width="100"
              lazy-src="/img/image.svg"
              :src="imagePath(item.image)" 
              alt="Image"
            ></v-img>
          </v-avatar>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { auth } from '@/store'
import { $axios } from '@/utils/nuxt-instance'
import { screen } from '@/utils/store-access'
import { Mode, Module, Action } from '@/models'


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
          text: 'Image',
          sortable: true,
          align: 'center',
          value: 'image',
        },
        {
          text: 'Code',
          sortable: true,
          align: 'center',
          value: 'code',
        },
        {
          text: 'SKU',
          sortable: true,
          align: 'center',
          value: 'sku',
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
          align: 'center',
          value: 'price',
        },
        {
          text: 'Quantity',
          sortable: true,
          align: 'center',
          value: 'quantity',
        },
        {
          text: 'Profit',
          sortable: true,
          align: 'center',
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
    'options.filter': function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.find()
      }
    },
    'options.page': function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.find()
      }
    },
    'options.itemsPerPage': function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.find()
      }
    },
  },
  computed: {
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
    canEdit() {
      const permissions = auth.$permissions
      return permissions.find(p => {
        return p.module === Module.PRODUCTS &&
          (p.action === Action.ALL || p.action === Action.UPDATE)
      })
    },
    canDelete() {
      const permissions = auth.$permissions
      return permissions.find(p => {
        return p.module === Module.PRODUCTS &&
          (p.action === Action.ALL || p.action === Action.DELETE)
      })
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
    },
    imagePath(img: string) {
      return `${process.env.apiUrl}/${img}`
    }
  },
  created() {
    if (this.isListMode) {
      this.find()
    } else {
      screen.setMode(Mode.LIST)
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
