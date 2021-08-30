<template>
  <form @submit.prevent="onSubmit">
    <v-row>
      <v-col cols="12" sm="12" md="2">
        <v-hover v-slot="{ hover }">
          <v-avatar size="150">
            <v-img style="position: absolute" :src="imagePreview" alt="Avatar">
            </v-img>

            <v-img v-if="hover" src="/img/image-hover.svg" alt="Avatar">
              <input
                type="file"
                accept="image/*"
                :disabled="isViewMode"
                style="opacity: 0; cursor: pointer"
                @change="changeImage($event)"
              />
            </v-img>
          </v-avatar>
        </v-hover>
      </v-col>
    </v-row>
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
    </v-row>
    <v-row>
      <v-col cols="12" sm="12" md="2">
        <v-text-field
          outlined
          required
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
          required
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
          required
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
          required
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
          required
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
          required
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
          required
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
          required
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
          required
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
          required
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
          required
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
      type: Number,
    },
  },
  computed: {
    isViewMode() {
      return screen.$mode === Mode.VIEW
    },
  },
  data() {
    return {
      form: {
        name: '',
        description: '',
        code: '',
        quantity: 0,
        unitCost: 0.0,
        shipCost: 0,
        totalCost: 0,
        price: 0,
        profit: 0,
        provider: {} as Fornecedor,
        category: {} as Categoria,
        image: '/img/image.svg',
      } as Produto,
      profit: 0,
      suppliers: [],
      categories: [],
      loading: false,
      imagePreview: '/img/image.svg'
    }
  },
  methods: {
    toBase64(file: File) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    },
    changeImage(event: any) {
      this.form.image = event.target.files[0]
      this.toBase64(this.form.image as File)
        .then(r => {
          this.imagePreview = r as string
        })
    },
    voltar() {
      this.$emit('id', undefined)
      screen.setMode(Mode.LIST)
    },
    onSubmit() {
      if (screen.$mode === Mode.ADD) {
        this.cadastrar()
      } else if (screen.$mode === Mode.EDIT) {
        this.alterar()
      }
    },
    buildFormData() {
      let formData = new FormData()
      formData.append('name', this.form.name)
      formData.append('description', this.form.description)
      formData.append('code', this.form.code)
      if (this.form.sku) 
        formData.append('sku', this.form.sku)
      formData.append('image', this.form.image)
      formData.append('quantity', this.form.quantity.toString())
      formData.append('unitCost', this.form.unitCost.toString())
      formData.append('shipCost', this.form.shipCost.toString())
      formData.append('totalCost', this.form.totalCost.toString())
      formData.append('price', this.form.price.toString())
      if (this.form.profit)
        formData.append('profit', this.form.profit.toString())
      if (this.form.category.id) 
        formData.append('categoryId', this.form.category.id)
      if (this.form.provider.id) 
        formData.append('providerId', this.form.provider.id)
      return formData
    },
    cadastrar() {
      this.loading = true
      const formData = this.buildFormData()
      $axios
        .$post(`/api/products`, formData)
        .then((r) => {
          this.loading = false
          snackbar.setMessage('Produto cadastrado com sucesso')
          snackbar.setSnackbar(true)
        })
        .catch((error) => {
          this.loading = false
        })
    },
    alterar() {
      this.loading = true
      const formData = this.buildFormData()
      $axios
        .$put(`/api/products/${this.id}`, formData)
        .then((r) => {
          this.loading = false
          this.voltar()
          snackbar.setMessage('Produto editado com sucesso')
          snackbar.setSnackbar(true)
        })
        .catch((error) => {
          this.loading = false
        })
    },
    find() {
      this.loading = true
      $axios
        .$get(`/api/products/${this.id}`)
        .then((r) => {
          this.loading = false
          this.form = r
          this.form.image = `${process.env.apiUrl}/${this.form.image}`
          this.imagePreview = this.form.image
        })
        .catch((error) => {
          this.loading = false
        })
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
    findSuppliers() {
      this.loading = true
      $axios
        .$get(`/api/providers/all`)
        .then((r) => {
          this.loading = false
          this.suppliers = r
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
    this.findSuppliers()
  },
})
</script>

<style lang="scss" scoped>
</style>
