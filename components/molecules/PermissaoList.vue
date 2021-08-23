<template>
  <v-row>
    <v-col cols="12" sm="12" md="12" class="d-flex justify-end">
      <v-btn @click="add" color="success"> Novo perfil </v-btn>
    </v-col>
    <v-col cols="12" md="12">
      <v-data-table
        no-data-text="Nenhum perfil cadastrado."
        :headers="headers"
        :items="roles"
        :loading="loading"
        :options.sync="options"
        loading-text="Carregando..."
      >
        <template v-slot:[`item.action`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-on="on" v-bind="attrs" icon @click.stop="view(item.id)">
                <v-icon> mdi-magnify </v-icon>
              </v-btn>
            </template>
            <span>Visualizar</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-on="on" v-bind="attrs" icon @click.stop="edit(item.id)">
                <v-icon> mdi-pencil </v-icon>
              </v-btn>
            </template>
            <span>Editar</span>
          </v-tooltip>

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
      headers: [
        {
          text: 'Id',
          sortable: true,
          align: 'start',
          value: 'id',
        },
        {
          text: 'Nome',
          sortable: true,
          align: 'start',
          value: 'name',
        },
        {
          text: 'Tag',
          sortable: true,
          align: 'start',
          value: 'tag',
        },
        {
          text: 'Opções',
          sortable: false,
          align: 'center',
          value: 'action',
        },
      ],
      roles: [],
    }
  },
  methods: {
    add() {
      screen.setMode(Mode.ADD)
    },
    find() {
      this.loading = true

      $axios.$get(`/api/roles`)
        .then(r => {
          this.loading = false
          this.roles = r
        })
        .catch(error => {
          this.loading = false
          if (error.response && error.response.data) {
            snackbar.setMessage(error.response.data.error)
          } else {
            snackbar.setMessage(
              'Não foi possível consultar os perfis, tente mais tarde.'
            )
          }

          snackbar.setSnackbar(true)
        })
    },
    view(id: number) {
      screen.setMode(Mode.VIEW)
      this.$emit('id', id)
    },
    edit(id: number) {
      screen.setMode(Mode.EDIT)
      this.$emit('id', id)
    },
    delete(id: number) {
      screen.setMode(Mode.DELETE)
      this.$emit('id', id)
    }
  },
  computed: {
    isListMode() {
      return screen.$mode === Mode.LIST
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
