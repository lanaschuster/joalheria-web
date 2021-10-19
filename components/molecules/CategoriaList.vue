<template>
  <v-row>
    <v-col cols="12" sm="12" md="3">
      <v-text-field
        label="Search"
        color="secondary"
        v-model="options.filter"
        placeholder="Search by name"
      ></v-text-field>
    </v-col>
    <v-col cols="12" sm="12" md="9" class="d-flex justify-end">
      <v-btn @click="add" color="success"> New Category </v-btn>
    </v-col>
    <v-col cols="12" md="12">
      <v-data-table
        no-data-text="Nenhuma categoria cadastrada."
        :headers="headers"
        :items="categories"
        :server-items-length="options.totalItems"
        :loading="loading"
        :options.sync="options"
        loading-text="Loading..."
      >
        <template v-slot:[`item.action`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-on="on" v-bind="attrs" icon @click.stop="visualizar(item.id)">
                <v-icon> mdi-magnify </v-icon>
              </v-btn>
            </template>
            <span>View</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-on="on" v-bind="attrs" icon @click.stop="editar(item.id)">
                <v-icon> mdi-pencil </v-icon>
              </v-btn>
            </template>
            <span>Edit</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-on="on" v-bind="attrs" icon @click.stop="excluir(item.id)">
                <v-icon> mdi-delete </v-icon>
              </v-btn>
            </template>
            <span>Delete</span>
          </v-tooltip>
        </template>
      </v-data-table>
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
      categories: [],
      loading: false,
      headers: [
        {
          text: 'Id',
          sortable: true,
          align: 'start',
          value: 'id',
        },
        {
          text: 'Name',
          sortable: true,
          align: 'start',
          value: 'name',
        },
        {
          text: 'Description',
          sortable: true,
          align: 'start',
          value: 'description',
        },
        {
          text: 'Options',
          sortable: false,
          align: 'center',
          value: 'action',
        },
      ]
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
    }
  },
  methods: {
    add() {
      screen.setMode(Mode.ADD)
    },
    find() {
      this.loading = true
      
      const filter = this.options.filter
      const size = this.options.itemsPerPage > -1
        ? this.options.itemsPerPage 
        : this.options.totalItems

      let url = `/api/categories?page=${this.options.page}&size=${size}`
      
      if (filter) {
        url = `${url}&filter=${filter}`
      }

      $axios.$get(url)
        .then(r => {
          this.loading = false
          this.categories = r.result
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
