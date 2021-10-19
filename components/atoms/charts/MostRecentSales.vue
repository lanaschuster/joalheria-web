<template>
  <v-card elevation="4" height="100%"> 
    <v-card-title class="title overline">Most recent sales</v-card-title>
    <v-card-text>
      <v-chip
        label
        color="primary"
        v-for="(sale, i) in sales"
        :key="`sale_${i}`"
        style="height: 100%"
        class="mb-4 d-flex justify-space-between"
      >
        <div>
          {{ new Date(sale.createdAt).toLocaleString() }}
        </div>
        <div>
          <strong>Total:</strong> {{ sale.total }} 
        </div>
      </v-chip>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { $axios } from '@/utils/nuxt-instance'
import { CardIndicador } from '@/components/atoms'

export default Vue.extend({
  components: {
    CardIndicador,
  },
  data() {
    return {
      loading: false,
      sales: [],
    }
  },
  methods: {
    find() {
      this.loading = true
      $axios
        .$get(`/api/sales/most-recent`)
        .then((r) => {
          this.loading = false
          this.sales = r
          console.log(r)
        })
        .catch((error) => {
          this.loading = false
        })
    },
  },
  created() {
    this.find()
  },
})
</script>

<style lang="scss" scoped>
::v-deep .v-chip__content {
  width: 100%;
  padding: 4px;
  display: flex;
  justify-content: space-between;
}
@media screen and (max-width: 1700px) {
  ::v-deep .v-chip__content {
    flex-direction: column;
    align-items: start;
    height: fit-content;
  }
}
</style>
