<template>
  <form @submit.prevent="onSubmit">
    <v-row>
      <v-col cols="12" sm="12" md="8">
        <v-card style="height: 100%" elevation="4">
          <v-card-title class="title overline"> Sale data </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  outlined
                  required
                  :readonly="isViewMode"
                  color="primary"
                  type="text"
                  label="Customer name"
                  v-model="form.clientName"
                  placeholder="Customer name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  outlined
                  :readonly="isViewMode"
                  color="primary"
                  type="email"
                  label="Customer e-mail"
                  v-model="form.clientEmail"
                  placeholder="Customer e-mail"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="11">
                <v-autocomplete
                  outlined
                  clearable
                  v-model="product"
                  :items="products"
                  :loading="productLoading"
                  :search-input.sync="productSearch"
                  hide-no-data
                  hide-selected
                  label="Product"
                  placeholder="Start typing to search"
                  return-object
                >
                  <template #selection="{ item }">
                    {{ item.name }}
                  </template>
                  <template #item="{ item }">
                    {{ item.code }} - {{ item.name }}
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="1" style="padding-left: 0; padding-right: 0">
                <v-btn color="success" fab @click="addItem">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="12" sm="12">
                <v-text-field
                  outlined
                  readonly
                  color="primary"
                  type="text"
                  label="Category"
                  :value="category"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  outlined
                  readonly
                  color="primary"
                  type="text"
                  label="Code"
                  :value="code"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  outlined
                  readonly
                  color="primary"
                  type="text"
                  label="SKU"
                  :value="sku"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  outlined
                  readonly
                  color="primary"
                  type="text"
                  label="Price"
                  :value="price? numberToStr(price) : ''"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="4">
        <v-card elevation="4" style="height: 100%">
          <v-card-title class="title overline"> Current Product </v-card-title>
          <v-card-text>
            <v-img
              style="margin: 0 auto; margin-top: 30px; border-radius: 10px"
              :src="image"
              height="420"
              width="420"
            ></v-img>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12">
        <v-card style="height: 100%" elevation="4">
          <v-card-title class="title overline"> Products </v-card-title>
          <v-card-text>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Code</th>
                    <th class="text-left">Product</th>
                    <th class="text-left">Qty</th>
                    <th class="text-left">Price</th>
                    <th class="text-left">Discount</th>
                    <th class="text-left">Total</th>
                    <th class="text-left">Options</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="saleProducts.length === 0">
                    <p
                      class="subtitle d-flex justify-start pl-10 pt-4"
                      style="width: 100%"
                    >
                      Nenhum produto adicionado
                    </p>
                  </tr>
                  <tr
                    v-else
                    v-for="(item, i) in saleProducts"
                    :key="`sale_prod_${i}`"
                  >
                    <td>{{ item.produto ? item.produto.code : '' }}</td>
                    <td>{{ item.produto ? item.produto.name : ''  }}</td>
                    <td>
                      <v-text-field
                        color="primary"
                        label=""
                        type="number"
                        min="0"
                        step="1"
                        v-model="item.quantity"
                        @input="onChangeQty(item, i)"
                      ></v-text-field>
                    </td>
                    <td>
                      <v-text-field
                        color="primary"
                        type="text"
                        label=""
                        v-money="mask"
                        v-model="values[i].price"
                        @input="onChangePrice(item, i)"
                      ></v-text-field>
                    </td>
                    <td>
                      <v-text-field
                        color="primary"
                        type="text"
                        label=""
                        v-money="mask"
                        v-model="values[i].discount"
                        @input="onChangeDiscount(item, i)"
                      ></v-text-field>
                    </td>
                    <td>{{ values[i].total }}</td>
                    <td>
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            color="error"
                            v-on="on"
                            v-bind="attrs"
                            icon
                            :disabled="isViewMode"
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
          </v-card-text>
        </v-card>
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
import { $axios } from '@/utils/nuxt-instance'
import { screen, snackbar } from '@/utils/store-access'
import { MoneyFormat } from '@/mixins'
import {
  Mode,
  Sale,
  SaleItem,
  SaleStatus,
  DiscountType,
  Produto,
  Categoria,
} from '@/models'

interface StrSaleItem {
  price: string,
  total: string,
  discount: string
}

export default MoneyFormat.extend({
  props: {
    id: {
      type: Number,
    },
  },
  data() {
    return {
      loading: false,
      productLoading: false,
      productSearch: '',
      form: {} as Sale,
      categories: [] as Categoria[],
      product: {
        code: '',
        sku: '',
      } as Produto,
      products: [] as Produto[],
      saleProducts: [] as SaleItem[],
      values: [] as StrSaleItem[]
    }
  },
  computed: {
    isViewMode(): boolean {
      return screen.$mode === Mode.VIEW
    },
    code(): string {
      if (this.product) return this.product.code
      return ''
    },
    sku(): string | undefined {
      if (this.product) return this.product.sku
      return ''
    },
    price(): number {
      if (this.product) return this.product.price
      return 0
    },
    image(): string {
      if (this.product && this.product.image) {
        return `${process.env.apiUrl}/${this.product.image}`
      }

      return `/img/image.svg`
    },
    category(): string {
      if (this.product && this.product.categoryId) {
        const id = this.product.categoryId
        const c = this.categories.find((c) => c.id === id)
        if (c) return c.name
      }
      return ''
    },
    items(): Array<Produto> {
      return this.products.map((entry) => {
        return Object.assign({}, entry, { name: entry.name })
      })
    },
  },
  watch: {
    productSearch(val) {
      if (this.products.length > 0) return
      if (this.productLoading) return

      this.productLoading = true

      $axios
        .$get('/api/products/all')
        .then((r) => {
          this.products = r
        })
        .finally(() => {
          this.productLoading = false
        })
    },
  },
  methods: {
    onChangeQty(item: SaleItem, index: number) {
      this.updateTotal(item, index)
    },
    onChangePrice(item: SaleItem, index: number) {
      item.price = this.strToNumber(this.values[index].price)
      this.updateTotal(item, index)
    },
    onChangeDiscount(item: SaleItem, index: number) {
      item.discount = this.strToNumber(this.values[index].discount)
      this.updateTotal(item, index)
    },
    updateTotal(item: SaleItem, index: number) {
      item.total = item.price * item.quantity - item.discount
      this.values[index].total = this.numberToStr(item.total)
    },
    onSubmit() {
      if (screen.$mode === Mode.ADD) {
        this.cadastrar()
      }
    },
    find() {
      // TODO
    },
    cadastrar() {
      // TODO
    },
    voltar() {
      this.$emit('id', undefined)
      screen.setMode(Mode.LIST)
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
    addItem() {
      const exists = this.saleProducts
        .find((p) => p.produto && p.produto.id === this.product.id)

      if (exists) {
        snackbar.setMessage('Product already added')
        snackbar.setSnackbar(true)
        return
      }

      this.values.push({
        price: this.numberToStr(this.product.price),
        discount: this.numberToStr(0),
        total: this.numberToStr(this.product.price),
      })

      this.saleProducts.push({
        produto: this.product,
        productId: this.product.id,
        quantity: 1,
        price: this.product.price,
        discount: 0,
        total: 0,
        discountType: DiscountType.VALOR
      })
    },
    deleteItem(index: number) {
      this.saleProducts.splice(index, 1)
    },
  },
  created() {
    if (this.id) {
      this.find()
    }

    this.findCategories()
  },
})
</script>

<style lang="scss" scoped>
</style>
