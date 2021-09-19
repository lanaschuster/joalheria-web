<template>
  <v-card elevation="4">
    <v-card-title class="title overline"> {{ title }} </v-card-title>
    <v-card-text class="d-flex justify-space-between pr-6">
      <v-icon x-large>{{ icon }}</v-icon>
      <p class="title text-h2 text-right">
        {{ value }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    value: {
      type: Number,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
