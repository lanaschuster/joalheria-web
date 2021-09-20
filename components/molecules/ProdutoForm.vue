<template>
  <form @submit.prevent="onSubmit">
    <v-row>
      <v-col cols="12" sm="12" md="2">
        <v-hover v-slot="{ hover }">
          <v-avatar size="150">
            <v-img
              lazy-src="/img/image.svg"
              style="position: absolute"
              :src="imagePreview"
              alt="Avatar"
            >
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
      <v-col cols="12" sm="12" md="6">
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
      <v-col cols="12" sm="12" md="3">
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
      <v-col cols="12" sm="12" md="3">
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
      <v-col cols="12" sm="12" md="3">
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
      <v-col cols="12" sm="12" md="3">
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

      <v-col cols="12" sm="12" md="3">
        <v-text-field
          ref="unitCost"
          outlined
          required
          :readonly="isViewMode"
          color="primary"
          type="text"
          v-money="mask"
          label="Unit cost"
          v-model.lazy="values.unitCost"
          placeholder="Unit cost"
          @input="onChangeUnitCost()"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="3">
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
      <v-col cols="12" sm="12" md="3">
        <v-text-field
          ref="price"
          outlined
          required
          :readonly="isViewMode"
          color="primary"
          type="text"
          v-money="mask"
          label="Sale price"
          v-model="values.price"
          placeholder="Sale price"
          @input="onChangePrice()"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="3">
        <v-text-field
          ref="profit"
          outlined
          readonly
          color="primary"
          type="text"
          v-money="mask"
          label="Profit"
          :value="profit"
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
import { Mode, Produto, Fornecedor, Categoria } from '@/models'
import { $axios } from '@/utils/nuxt-instance'
import { screen, snackbar } from '@/utils/store-access'
import { MoneyFormat } from '@/mixins'

export default MoneyFormat.extend({
  props: {
    id: {
      type: Number,
    },
  },
  data() {
    return {
      form: {
        name: '',
        description: '',
        code: '',
        quantity: 0,
        unitCost: 0,
        totalCost: 0,
        price: 0,
        profit: 0,
        provider: {} as Fornecedor,
        category: {} as Categoria,
        image: '/img/image.svg',
      } as Produto,
      values: {
        unitCost: '',
        shipCost: '',
        price: '',
      },
      suppliers: [],
      categories: [],
      loading: false,
      imagePreview: '/img/image.svg',
    }
  },
  computed: {
    isViewMode(): boolean {
      return screen.$mode === Mode.VIEW
    },
    profit(): string {
      const calc = this.numberToStr(this.form.price - this.form.unitCost)
      if (this.$refs.profit) {
        (this.$refs.profit as Vue).$el.getElementsByTagName('input')[0].value = calc
        this.form.profit = this.strToNumber(calc)
      }

      return calc
    },
    total(): string {
      const calc = this.numberToStr(this.form.unitCost)
      if (this.$refs.totalCost) {
        (this.$refs.totalCost as Vue).$el.getElementsByTagName('input')[0].value = calc
        this.form.totalCost = this.strToNumber(calc)
      }

      return calc
    },
  },
  methods: {
    onChangeUnitCost() {
      this.form.unitCost = this.strToNumber(this.values.unitCost)
    },
    onChangePrice() {
      this.form.price = this.strToNumber(this.values.price)
    },
    toBase64(file: File) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    },
    changeImage(event: any) {
      this.form.image = event.target.files[0]
      this.toBase64(this.form.image as File).then((r) => {
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
      if (this.form.sku) formData.append('sku', this.form.sku)
      formData.append('image', this.form.image)
      formData.append('quantity', this.form.quantity.toString())
      formData.append('unitCost', this.form.unitCost.toString())
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
    async find() {
      this.loading = true
      await $axios
        .$get(`/api/products/${this.id}`)
        .then((r) => {
          this.loading = false
          this.form = r

          const unitCost = this.numberToStr(r.unitCost)

          if (this.$refs.unitCost)
            (this.$refs.unitCost as Vue)
              .$el.getElementsByTagName('input')[0].value = unitCost
          this.values.unitCost = unitCost

          const shipCost = this.numberToStr(r.shipCost)
          if (this.$refs.shipCost)
            (this.$refs.shipCost as Vue).$el.getElementsByTagName('input')[0].value = shipCost
          this.values.shipCost = shipCost

          const totalCost = this.numberToStr(r.totalCost)
          if (this.$refs.totalCost)
           ( this.$refs.totalCost as Vue).$el.getElementsByTagName('input')[0].value = totalCost

          const price = this.numberToStr(r.price)
          if (this.$refs.price)
            (this.$refs.price as Vue).$el.getElementsByTagName('input')[0].value = price
          this.values.price = price

          const profit = this.numberToStr(r.profit)
          if (this.$refs.profit)
            (this.$refs.profit as Vue).$el.getElementsByTagName('input')[0].value = profit

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
