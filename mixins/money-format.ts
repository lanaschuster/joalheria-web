import Vue from 'vue'

export default Vue.extend({
  data() { 
    return {
      mask: {
        decimal: ',',
        thousands: '.',
        prefix: '$ ',
        precision: 2,
        masked: false
      }
    }
  },
  methods: {
    strToNumber(val: string): number {
      let unformated = val.replace(/\./g, '').replace(/,/g, '.')
      unformated = unformated.replace(this.mask.prefix, '')
      return parseFloat(unformated)
    },
    numberToStr(val: number): string {
      return val
        .toLocaleString('pt-br', { minimumFractionDigits: 2 })
        .toString()
    },
  }
})
