<template>
  <v-row>
    <v-col cols="12" md="12">
      <v-data-table
        no-data-text="Nenhuma venda registrada."
        :headers="headers"
        :items="sales"
        :server-items-length="options.totalItems"
        :loading="loading"
        :options.sync="options"
        loading-text="Carregando..."
      >
        <template v-slot:[`item.action`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-on="on"
                v-bind="attrs"
                icon
                @click.stop="visualizar(item.id)"
              >
                <v-icon> mdi-magnify </v-icon>
              </v-btn>
            </template>
            <span>View sale</span>
          </v-tooltip>

          <v-tooltip top v-if="canDelete && item.status == 'ACTIVE'">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-on="on"
                v-bind="attrs"
                icon
                color="error"
                @click.stop="cancel(item.id)"
              >
                <v-icon> mdi-close-box </v-icon>
              </v-btn>
            </template>
            <span>Cancel sale</span>
          </v-tooltip>
        </template>

        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            :color="item.status == 'ACTIVE' ? 'green' : 'red'"
            text-color="white"
          >
            {{ item.status == 'ACTIVE' ? 'Active' : 'Canceled' }}
          </v-chip>
        </template>
        <template v-slot:[`item.createdAt`]="{ item }">
          {{ new Date(item.createdAt).toLocaleString() }}
        </template>
        <template v-slot:[`item.total`]="{ item }">
          {{ numberToStr(item.total) }}
        </template>
      </v-data-table>
      <v-pagination
        v-model="options.page"
        :length="options.pageCount"
      ></v-pagination>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { auth } from '@/store'
import { MoneyFormat } from '@/mixins'
import { $axios } from '@/utils/nuxt-instance'
import { screen, snackbar } from '@/utils/store-access'
import { Mode, Module, Action } from '@/models'

export default MoneyFormat.extend({
  data() {
    return {
      options: {
        filter: '',
        pageCount: 0,
        page: 1,
        itemsPerPage: 10,
        totalItems: 0,
      },

      loading: false,
      headers: [
        {
          text: 'Status',
          sortable: true,
          align: 'center',
          value: 'status',
        },
        {
          text: 'Date',
          sortable: true,
          align: 'center',
          value: 'createdAt',
        },
        {
          text: 'Customer',
          sortable: true,
          align: 'center',
          value: 'clientName',
        },
        {
          text: 'Total',
          sortable: true,
          align: 'center',
          value: 'total',
        },
        {
          text: 'Options',
          sortable: false,
          align: 'center',
          value: 'action',
        },
      ],
      sales: [],
    }
  },
  watch: {
    isListMode: function (val) {
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
      return permissions.find((p) => {
        return (
          p.module === Module.USERS &&
          (p.action === Action.ALL || p.action === Action.WRITE)
        )
      })
    },
    canEditUser() {
      const permissions = auth.$permissions
      return permissions.find((p) => {
        return (
          p.module === Module.USERS &&
          (p.action === Action.ALL || p.action === Action.UPDATE)
        )
      })
    },
    canDelete() {
      const permissions = auth.$permissions
      return permissions.find((p) => {
        return (
          p.module === Module.USERS &&
          (p.action === Action.ALL || p.action === Action.DELETE)
        )
      })
    },
  },
  methods: {
    find() {
      this.loading = true

      const filter = this.options.filter
      const size =
        this.options.itemsPerPage > -1
          ? this.options.itemsPerPage
          : this.options.totalItems

      let url = `/api/sales?page=${this.options.page}&size=${size}`

      if (filter) {
        url = `${url}&filter=${filter}`
      }

      $axios
        .$get(url)
        .then((r) => {
          this.loading = false
          this.sales = r.result
          this.options.pageCount = r.pages
          this.options.totalItems = r.count
        })
        .catch((error) => {
          this.loading = false
        })
    },
    visualizar(id: number) {
      screen.setMode(Mode.VIEW)
      this.$emit('id', id)
    },
    cancel(id: number) {
      $axios
        .$post(`/api/sales/${id}/cancel`)
        .then((r) => {
          this.find()
          this.loading = false
          snackbar.setMessage('Canceled sale.')
          snackbar.setSnackbar(true)
        })
        .catch((error) => {
          this.loading = false
        })
    },
    newSale() {
      screen.setMode(Mode.ADD)
    },
  },
  created() {
    if (this.isListMode) {
      this.find()
    } else {
      screen.setMode(Mode.LIST)
    }
  },
})
</script>

<style lang="scss" scoped>
</style>
