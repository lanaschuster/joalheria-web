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
          label="Name"
          v-model="form.name"
          placeholder="Name"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="12">
        <v-textarea
          outlined
          required
          :readonly="isViewMode"
          color="primary"
          type="textarea"
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
  data() {
    return {
      form: {
        name: '',
        description: ''
      },
      loading: false,
    }
  },
  computed: {
    isViewMode() {
      return screen.$mode === Mode.VIEW
    }
  },
  methods: {
    onSubmit() {
      if (screen.$mode === Mode.ADD) {
        this.cadastrar()
      } else if (screen.$mode === Mode.EDIT) {
        this.alterar()
      }
    },
    cadastrar() {
      this.loading = true

      $axios.$post(`/api/categories`, this.form)
        .then(r => {
          this.loading = false
          this.voltar()
          snackbar.setMessage('Categoria cadastrada com sucesso')
          snackbar.setSnackbar(true)
        })
        .catch(error => {
          this.loading = false
        })
    },
    alterar() {
      this.loading = true
      $axios.$put(`/api/categories/${this.id}`, this.form)
        .then(r => {
          this.loading = false
          this.voltar()
          snackbar.setMessage('Categoria editado com sucesso')
          snackbar.setSnackbar(true)
        })
        .catch(error => {
          this.loading = false
        })
    },
    voltar() {
      this.$emit('id', undefined)
      screen.setMode(Mode.LIST)
    },
    find() {
      this.loading = true
      $axios.$get(`/api/categories/${this.id}`)
        .then(r => {
          this.loading = false
          this.form = r
        })
        .catch(error => {
          this.loading = false
        })
    },
  },
  created() {
    if (this.id) {
      this.find()
    }
    
  }
})
</script>

<style lang="scss" scoped>
</style>
