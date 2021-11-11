<template>
  <v-card elevation="4" class="indicador-card">
    <v-card-title class="indicador-title title overline"> {{ title }} </v-card-title>
    <v-card-text class="d-flex justify-space-between pr-6">
      <v-icon class="indicador-icon">{{ icon }}</v-icon>
      <span class="indicador-value title text-h2 text-right">
        {{ value }}
      </span>
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

<style scoped>
.indicador-icon {
  font-size: 2.4rem;
}
.indicador-title {
  word-break: initial;
}
.indicador-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
@media screen and (min-width: 1025px) and (max-width: 1385px) {
  .indicador-title {
    font-size: 10px !important;
    word-break: initial;
  }
  .indicador-icon {
    font-size: 2rem;
  }
  .indicador-value {
    font-size: 3rem !important;
  }
}
</style>
