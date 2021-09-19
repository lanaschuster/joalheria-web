<template>
  <CardIndicador title="Users" icon="mdi-account-group" :value="amount" />
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
      amount: 0,
    }
  },
  methods: {
    count() {
      this.loading = true
      $axios
        .$get(`/api/users/count`)
        .then((r) => {
          this.loading = false
          this.amount = r.amount
        })
        .catch((error) => {
          this.loading = false
        })
    },
  },
  created() {
    this.count()
  },
})
</script>

<style lang="scss" scoped>
</style>
