<template>
  <v-row>
    <v-col cols="12" sm="12" md="3">
      <v-text-field
        label="Buscar"
        color="secondary"
        v-model="options.filter"
        placeholder="Digite para filtrar por nome, sobrenome e e-mail"
      ></v-text-field>
    </v-col>
    <v-col 
      cols="12" sm="12" md="9" 
      class="d-flex align-center justify-end">
      <v-btn @click="novoUsuario" color="success">
        Novo usuário
      </v-btn>
    </v-col>
    <v-col cols="12" md="12">
      <v-data-table
        no-data-text="Nenhum usuário cadastrado."
        :headers="headers"
        :items="users"
        :server-items-length="options.totalItems"
        :loading="loading"
        :options.sync="options"
        loading-text="Carregando..."
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

          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-on="on" v-bind="attrs" icon @click.stop="editar(item.id)">
                <v-icon> mdi-pencil </v-icon>
              </v-btn>
            </template>
            <span>Editar</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-on="on" v-bind="attrs" icon @click.stop="excluir(item.id)">
                <v-icon> mdi-delete </v-icon>
              </v-btn>
            </template>
            <span>Excluir</span>
          </v-tooltip>
        </template>

        <template v-slot:[`item.isActive`]="{ item }">
          <v-chip>
            {{ item.isActive ? 'Ativo' : 'Bloqueado' }}
          </v-chip>
        </template>

        <template v-slot:[`item.role`]="{ item }">
          <v-chip>
            {{ item.role.name }}
          </v-chip>
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
          text: 'Sobrenome',
          sortable: true,
          align: 'start',
          value: 'lastName',
        },
        {
          text: 'E-mail',
          sortable: true,
          align: 'center',
          value: 'email',
        },
        {
          text: 'Permissão',
          sortable: false,
          align: 'center',
          value: 'role.name',
        },
        {
          text: 'Status',
          sortable: true,
          align: 'center',
          value: 'isActive',
        },
        {
          text: 'Opções',
          sortable: false,
          align: 'center',
          value: 'action',
        },
      ],
      users: [],
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

      let url = `/api/users?page=${this.options.page}&size=${size}`
      
      if (filter) {
        url = `${url}&filter=${filter}`
      }

      $axios.$get(url)
        .then(r => {
          this.loading = false
          this.users = r.result
          this.options.pageCount = r.pages
          this.options.totalItems = r.count
        })
        .catch(error => {
          this.loading = false
          if (error.response && error.response.data) {
            snackbar.setMessage(error.response.data.error)
          } else {
            snackbar.setMessage(
              'Não foi possível consultar os usuários, tente mais tarde.'
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
    novoUsuario() {
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
