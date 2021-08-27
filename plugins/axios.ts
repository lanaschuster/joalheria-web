import { Plugin } from '@nuxt/types'
import { snackbar } from '@/utils/store-access'


const axiosPlugin: Plugin = ({ app, store, redirect }) => {
  app.$axios.onRequest((config) => {
    const token = app.$cookies.get('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  })

  app.$axios.onError((error) => {
    if (error.response?.status === 401) {
      const refresh = app.$cookies.get('refresh')
      store.dispatch('auth/refresh', refresh)
    } else if (error.response?.status === 400) {
      snackbar.setMessage(error.response.data.message)
      snackbar.setSnackbar(true)
    }
  })
}

export default axiosPlugin
