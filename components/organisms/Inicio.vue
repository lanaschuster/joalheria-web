<template>
  <v-row>
    <v-col cols="12" sm="12" class="mb-8">
      <h1 class="title text-h4">Welcome, {{ username }}</h1>
    </v-col>
    <v-col cols="12" sm="12" md="3">
      <CardIndicador
        title="Users"
        icon="mdi-account-group"
        :value="userAmount"
      />
    </v-col>
    <v-col cols="12" sm="12" md="3">
      <CardIndicador
        title="Suppliers"
        icon="mdi-store"
        :value="supplierAmount"
      />
    </v-col>
    <v-col cols="12" sm="12" md="3">
      <CardIndicador
        title="Products"
        icon="mdi-ring"
        :value="productAmount"
      />
    </v-col>
    <v-col cols="12" sm="12" md="3">
      <CardIndicador
        title="Categories"
        icon="mdi-tag-multiple"
        :value="categoryAmount"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { $axios } from '@/utils/nuxt-instance'
import { CardIndicador } from '@/components/atoms'

export default Vue.extend({
  components: {
    CardIndicador
  },
  data() {
    return {
      loading: false,
      username: '',
      userAmount: 0,
      supplierAmount: 0,
      productAmount: 0,
      categoryAmount: 0
    }
  },
  methods: {
    find() {
      this.loading = true
      $axios
        .$get(`/api/users/myself`)
        .then((r) => {
          this.loading = false
          this.username = r.user.name
        })
        .catch((error) => {
          this.loading = false
        })
    },
    findUserAmount() {
      this.loading = true
      $axios
        .$get(`/api/users/count`)
        .then((r) => {
          this.loading = false
          this.userAmount = r.amount
        })
        .catch((error) => {
          this.loading = false
        })
    },
    findSupplierAmount() {
      this.loading = true
      $axios
        .$get(`/api/providers/count`)
        .then((r) => {
          this.loading = false
          this.supplierAmount = r.amount
        })
        .catch((error) => {
          this.loading = false
        })
    },
    findProductAmount() {
      this.loading = true
      $axios
        .$get(`/api/products/count`)
        .then((r) => {
          this.loading = false
          this.productAmount = r.amount
        })
        .catch((error) => {
          this.loading = false
        })
    },
    findCategoryAmount() {
      this.loading = true
      $axios
        .$get(`/api/categories/count`)
        .then((r) => {
          this.loading = false
          this.categoryAmount = r.amount
        })
        .catch((error) => {
          this.loading = false
        })
    },
  },
  created() {
    this.find()
    this.findUserAmount()
    this.findSupplierAmount()
    this.findProductAmount()
    this.findCategoryAmount()
  },
})
</script>

<style lang="scss" scoped>
</style>
