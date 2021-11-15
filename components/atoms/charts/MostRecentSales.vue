<template>
  <v-card elevation="4">
    <v-card-title class="title overline d-flex justify-space-between align-center">
      <span>Most recent sales</span>
      <v-btn text color="secondary" style="color: #212121 !important;"  nuxt to="sales">View more</v-btn>
    </v-card-title>
    <v-card-text>
      <div
        v-for="(sale, i) in sales"
        :key="`sale_${i}`"
        style="height: 100%"
        class="mb-4 chip"
      >
        <span>
          {{ new Date(sale.createdAt).toLocaleString() }}
        </span>
        <span><strong class="mr-2">Total:</strong> {{ sale.total.toFixed(2) }}</span>
      </div>
    </v-card-text>
    <v-card-actions>
      
    </v-card-actions>
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
.chip {
  border-radius: 4px;
  padding: 4px .8rem;
  display: flex;
  justify-content: space-between;
  align-content: center;
}
.chip:hover {
  background-color: #efefef;
  border-radius: 0px;
}
.chip span {
  word-break: initial;
  height: 3rem;
  display: flex;
  align-items: center;
  /* padding-right: 1px; */
}
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
