<template>
  <form @submit.prevent="onSubmit">
    <v-row>
      <v-col cols="12" sm="12" md="6">
        <v-text-field
          outlined
          required
          :readonly="isViewMode"
          color="primary"
          type="text"
          label="Nome"
          v-model="form.role.name"
          placeholder="Nome do perfil"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="6">
        <v-text-field
          outlined
          required
          :readonly="isViewMode"
          color="primary"
          type="text"
          label="Tag"
          v-model="form.role.tag"
          placeholder="Tag único"
        ></v-text-field>
      </v-col>

      <v-col v-if="!isViewMode" cols="12" sm="12" md="6">
        <v-select
          outlined
          :disabled="isViewMode"
          color="primary"
          :items="modules"
          v-model="form.module"
          label="Funcionalidade"
        >
          <template #item="{ item }">
            <span class="primary--text">{{ item }}</span>
          </template>
          <template #selection="{ item }">
            {{ item }}
          </template>
        </v-select>
      </v-col>
      <v-col v-if="!isViewMode" cols="12" sm="12" md="5">
        <v-select
          outlined
          :disabled="isViewMode"
          color="primary"
          :items="actions"
          v-model="form.action"
          label="Ação"
        >
          <template #item="{ item }">
            <span class="primary--text">{{ item }}</span>
          </template>
          <template #selection="{ item }">
            {{ item }}
          </template>
        </v-select>
      </v-col>

      <v-col v-if="!isViewMode" cols="12" sm="12" md="1">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              color="success"
              v-on="on"
              v-bind="attrs"
              @click="addItem"
            >
              <v-icon>mdi-plus-circle</v-icon>
            </v-btn>
          </template>
          <span>Adicionar</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Funcionalidade</th>
                <th class="text-left">Ação</th>
                <th class="text-left">Opções</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="form.permissoes.length === 0">
                <p
                  class="subtitle d-flex justify-start pl-10 pt-4"
                  style="width: 100%"
                >
                  Nenhuma permissão adicionada
                </p>
              </tr>
              <tr
                v-else
                v-for="(item, i) in form.permissoes"
                :key="`permissao_${i}`"
              >
                <td>{{ item.module }}</td>
                <td>{{ item.action }}</td>
                <td>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="error"
                        v-on="on"
                        v-bind="attrs"
                        icon
                        @click.stop="deleteItem(i)"
                      >
                        <v-icon> mdi-delete </v-icon>
                      </v-btn>
                    </template>
                    <span>Remover</span>
                  </v-tooltip>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col cols="12" sm="12" md="12">
        <v-btn @click="voltar" color="primary" outlined>Voltar</v-btn>
        <v-btn color="success" type="submit" :loading="loading">Salvar</v-btn>
      </v-col>
    </v-row>
  </form>
</template>

<script lang="ts">
import Vue from 'vue'
import { Mode, Action, Module, Role } from '@/models'
import { screen, snackbar } from '@/utils/store-access'
import { $axios } from '@/utils/nuxt-instance'

interface Permissao {
  action: string
  module: string
}

export default Vue.extend({
  props: {
    id: {
      type: Number
    },
  },
  data() {
    return {
      form: {
        role: {} as Role,
        permissoes: [] as Permissao[],
        action: '',
        module: '',
      },
      loading: false,
    }
  },
  methods: {
    onSubmit() {
      if (this.form.permissoes.length === 0) {
        snackbar.setMessage('Adicione as permissões corretamente')
        snackbar.setSnackbar(true)
        return
      }

      if (screen.$mode === Mode.ADD) {
        this.add()
      } else if (screen.$mode === Mode.EDIT) {
        this.edit()
      }
    },
    deleteItem(index: number) {
      this.form.permissoes.splice(index, 1)
    },
    addItem() {
      const exists = this.form.permissoes.find((item) => {
        const sameAction = item.action === this.form.action
        const sameModule = item.module === this.form.module
        return sameAction && sameModule
      })

      if (exists) {
        snackbar.setMessage('Permissão já adicionada')
        snackbar.setSnackbar(true)
        return
      }

      if (this.form.action === Action.ALL) {
        this.form.permissoes = this.form.permissoes.filter((item) => {
          return item.module !== this.form.module
        })
      }

      this.form.permissoes.push({
        action: this.form.action,
        module: this.form.module,
      })
    },
    add() {
      this.loading = true

      let body = { 
        ...this.form.role,
        permissions: this.form.permissoes
      }

      $axios
        .$post(`/api/roles`, body)
        .then(r => {
          this.loading = false
          this.voltar()
          snackbar.setMessage('Perfil criado com sucesso')
          snackbar.setSnackbar(true)
        })
        .catch((error) => {
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
    edit() {},
    find() {
      this.loading = true

      $axios
        .$get(`/api/roles/${this.id}/grants`)
        .then(r => {
          this.loading = false
          this.form.role = r.role
          this.form.permissoes = r.permissions ? r.permissions : []
        })
        .catch((error) => {
          this.loading = false
          if (error.response && error.response.data) {
            snackbar.setMessage(error.response.data.error)
          } else {
            snackbar.setMessage(
              'Não foi possível consultar, tente mais tarde.'
            )
          }

          snackbar.setSnackbar(true)
        })
    },
    voltar() {
      screen.setMode(Mode.LIST)
    },
  },
  computed: {
    isViewMode() {
      return screen.$mode === Mode.VIEW
    },
    actions() {
      return Object.values(Action)
    },
    modules() {
      return Object.values(Module)
    },
  },
  created() {
    if (this.isViewMode) {
      this.find()
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
