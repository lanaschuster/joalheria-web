<template>
  <!--
    FIXME: esse componente está terrivelmente grande!
  -->
  <form @submit.prevent="onSubmit">
    <v-row v-if="!isViewMode">
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
              <v-col cols="12" md="12" lg="11" >
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
              <v-col cols="12" md="12" lg="1"
                :style="{
                  'padding-left': breakpoint !== 'lg' ? '12px':0, 
                  'padding-right': breakpoint !== 'lg' ? '12px':0,
                }">
                <v-btn
                  color="success"
                  @click="addItem"
                  :block="breakpoint !== 'lg' && breakpoint !== 'xl'"
                  :fab="breakpoint === 'lg' || breakpoint === 'xl'"
                >
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
                  :value="price ? numberToStr(price) : ''"
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
              :height="imgHeight"
              :width="imgHeight"
            ></v-img>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="isViewMode" cols="12" sm="12">
        <v-chip
          :color="form.status == 'ACTIVE' ? 'green' : 'red'"
          text-color="white"
          class="mr-2"
        >
          {{ form.status == 'ACTIVE' ? 'Active' : 'Canceled' }}
        </v-chip>
        <v-chip class="mr-2">
          <strong>Client:</strong> {{ form.clientName }}
        </v-chip>
        <v-chip>
          <strong>E-mail:</strong> {{ form.clientEmail }}
        </v-chip>
      </v-col>
      <v-col cols="12" sm="12">
        <v-card style="height: 100%" elevation="4">
          <v-card-title class="title overline"> Products </v-card-title>
          <v-card-text>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Code</th>
                    <th class="text-left" width="30%">Product</th>
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
                    <td>{{ item.product ? item.product.code : '' }}</td>
                    <td>{{ item.product ? item.product.name : '' }}</td>
                    <td>
                      <v-text-field
                        color="primary"
                        label=""
                        type="number"
                        min="0"
                        step="1"
                        :readonly="isViewMode"
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
                        :readonly="isViewMode"
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
                        :readonly="isViewMode"
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
      <v-col cols="12" sm="12">
        <v-card style="height: 100%" elevation="4">
          <v-card-title class="title overline"> Total </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="2">
                <v-text-field
                  readonly
                  color="primary"
                  type="text"
                  label="Subtotal"
                  v-money="mask"
                  :value="subtotal"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="2">
                <v-text-field
                  v-if="!isViewMode"
                  color="primary"
                  type="text"
                  label="Ship cost"
                  v-money="mask"
                  v-model="totalValues.shipCost"
                  @input="onChangeShipCost"
                ></v-text-field>
                <v-text-field
                  v-else
                  color="primary"
                  type="text"
                  label="Ship cost"
                  v-money="mask"
                  :readonly="isViewMode"
                  :value="totalValues.shipCost"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="2">
                <v-text-field
                  v-if="!isViewMode"
                  color="primary"
                  type="text"
                  label="Discount"
                  v-money="mask"
                  v-model="totalValues.discount"
                  @input="onChangeFinalDiscount"
                ></v-text-field>
                <v-text-field
                  v-else
                  color="primary"
                  type="text"
                  label="Discount"
                  v-money="mask"
                  :readonly="isViewMode"
                  :value="totalValues.discount"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-radio-group
                  row
                  label="Discount type"
                  v-model="form.discountType"
                  :disabled="isViewMode"
                >
                  <v-radio label="%" value="PORCENTAGEM"></v-radio>
                  <v-radio label="$" value="VALOR"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12" sm="2" class="ml-auto">
                <v-text-field
                  readonly
                  color="primary"
                  type="text"
                  label="Total"
                  v-money="mask"
                  :value="total"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <v-btn outlined color="primary" @click="voltar">Back</v-btn>
        <v-btn
          type="submit"
          v-if="!isViewMode"
          color="primary"
          :loading="loading"
        >
          Save
        </v-btn>
      </v-col>
    </v-row>
  </form>
</template>

<script lang="ts">
import { MoneyFormat } from '@/mixins'
import { $axios } from '@/utils/nuxt-instance'
import { screen, snackbar } from '@/utils/store-access'
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
  price: string
  total: string
  discount: string
  shipCost?: string
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
      form: {
        status: SaleStatus.ACTIVE,
        discount: 0,
        discountType: DiscountType.PORCENTAGEM,
      } as Sale,
      categories: [] as Categoria[],
      product: {
        code: '',
        sku: '',
      } as Produto,
      products: [] as Produto[],
      saleProducts: [] as SaleItem[],
      values: [] as StrSaleItem[],
      totalValues: {} as StrSaleItem,
    }
  },
  computed: {
    isViewMode(): boolean {
      return screen.$mode === Mode.VIEW
    },
    breakpoint(): string {
      return (this as any).$vuetify.breakpoint.name
    },
    imgHeight(): string {
      const w = window.innerWidth
      if (w <= 1440) return '300'
      return '420'
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
    subtotal(): string {
      if (this.saleProducts.length === 0) return this.numberToStr(0)

      const sub = this.saleProducts
        .map((item) => item.total)
        .reduce((prev, curr) => prev + curr)

      return this.numberToStr(sub)
    },
    total(): string {
      if (this.saleProducts.length === 0) return this.numberToStr(0)

      let t = this.saleProducts
        .map((item) => item.total)
        .reduce((prev, curr) => prev + curr)

      if (this.form.discountType === DiscountType.PORCENTAGEM) {
        t = t - (t * this.form.discount) / 100 + this.form.shipCost
      } else {
        t = t - this.form.discount + this.form.shipCost
      }

      return this.numberToStr(t)
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
    onChangeShipCost() {
      if (this.totalValues.shipCost) {
        const shipCost = this.strToNumber(this.totalValues.shipCost)
        this.$set(this.form, 'shipCost', shipCost)
      }
    },
    onChangeFinalDiscount() {
      const discount = this.strToNumber(this.totalValues.discount)
      this.$set(this.form, 'discount', discount)
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
    async find() {
      this.loading = true
      await $axios
        .$get(`/api/sales/${this.id}/items`)
        .then((r) => {
          this.loading = false
          this.form = { ...r.sale }
          this.saleProducts = r.saleItems

          this.totalValues.total = this.numberToStr(this.form.total)
          this.totalValues.shipCost = this.numberToStr(this.form.shipCost)
          this.totalValues.discount = this.numberToStr(this.form.discount)

          this.saleProducts.forEach(item => {
            this.values.push({
              price: item.product ? this.numberToStr(item.product.price) : this.numberToStr(0),
              discount: this.numberToStr(item.discount),
              total: this.numberToStr(item.total),
            })
          })
        })
        .catch((error) => {
          this.loading = false
        })
    },
    cadastrar() {
      this.loading = true
      const body = {
        ...this.form,
        obs: '',
        saleItems: this.saleProducts,
        total: this.strToNumber(this.total)
      }

      $axios
        .$post(`/api/sales`, body)
        .then((r) => {
          this.loading = false
          snackbar.setMessage('Venda cadastrada com sucesso')
          snackbar.setSnackbar(true)
        })
        .catch((error) => {
          this.loading = false
        })
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
      if (!this.product || !this.product.code) return
      const exists = this.saleProducts.find(
        (p) => p.product && p.product.id === this.product.id
      )

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
        product: this.product,
        productId: this.product.id,
        quantity: 1,
        price: this.product.price,
        discount: 0,
        total: 0,
        discountType: DiscountType.VALOR,
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
