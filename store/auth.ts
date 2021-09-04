import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { $axios, $cookies } from '~/utils/nuxt-instance'
import { snackbar } from '@/store'


import { Credentials } from '@/models'

interface Token {
  access?: string
  refresh?: string
}

@Module({ name: 'auth', stateFactory: true, namespaced: true })
export default class Auth extends VuexModule {
  private accessToken: undefined | string
  private refreshToken: undefined | string
  private loading: boolean = false

  public get $accessToken() {
    return this.accessToken
  }

  public get $refreshToken() {
    return this.refreshToken
  }

  public get $loading() {
    return this.loading
  }

  public get $header() {
    return {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    }
  }

  @Mutation
  private SET_LOADING(isLoading: boolean) {
    this.loading = isLoading
  }

  @Mutation
  private SET_ACCESS_TOKEN(accessToken: string) {
    this.accessToken = accessToken
    $cookies.remove('token')
    $cookies.set('token', accessToken, {
      maxAge: 3600
    })
  }
  
  @Mutation
  private SET_REFRESH_TOKEN(refreshToken: string) {
    this.refreshToken = refreshToken
    $cookies.remove('refresh')
    $cookies.set('refresh', refreshToken, {
      maxAge: 3600
    })
  }

  @Mutation
  private LOGOUT() {
    this.refreshToken = undefined
    this.accessToken = undefined
    $cookies.remove('token')
    $cookies.remove('refresh')
  }

  @Mutation
  private UPDATE_TOKENS(tokens: Token) {
    this.refreshToken = tokens?.refresh || undefined
    this.accessToken = tokens?.access || undefined
  }

  @Action
  public async login(credentials: Credentials) {
    try {
      this.context.commit('SET_LOADING', true)
      $axios.post('/auth/login', credentials)
        .then(result => {
          this.context.commit('SET_REFRESH_TOKEN', result.data.refreshToken)
          this.context.commit('SET_ACCESS_TOKEN', result.data.accessToken)
          this.context.commit('SET_LOADING', false)

          window.$nuxt.$router.push({
            path: '/dashboard/inicio'
          })
        })
        .catch(error => {
          this.context.commit('SET_LOADING', false)
          if (error.response && error.response.data) {
            snackbar.setMessage(error.response.data.error)
          } else {
            snackbar.setMessage('Não foi possível efetuar o login, tente mais tarde.')
          }

          snackbar.setSnackbar(true)
        })
    } catch (err) {
      snackbar.setMessage('Não foi possível efetuar o login.')
      snackbar.setSnackbar(true)
    }
  }

  @Action
  public update(tokens: Token) {
    const access = tokens?.access ? tokens?.access : $cookies.get('token')
    const refresh = tokens?.refresh ? tokens?.refresh : $cookies.get('refresh')
    this.context.commit('UPDATE_TOKENS', { access, refresh })
  }

  @Action
  public logout() {
    this.context.commit('LOGOUT')
    window.$nuxt.$router.push({
      path: '/'
    })
  }

  @Action
  public refresh(refreshToken: string) {
    try {
      $axios.post('/auth/refresh', { refreshToken })
        .then(result => {
          this.context.commit('SET_REFRESH_TOKEN', result.data.refreshToken)
          this.context.commit('SET_ACCESS_TOKEN', result.data.accessToken)
        })
        .catch(error => {
          this.context.commit('LOGOUT')
          window.$nuxt.$router.push({
            path: '/'
          })
          
          snackbar.setMessage('A sessão expirou. Realize o login novamente')
          snackbar.setSnackbar(true)
        })
    } catch (err) {
      snackbar.setMessage('Não foi possível atualizar a sessão')
      snackbar.setSnackbar(true)
    }
  }
}
