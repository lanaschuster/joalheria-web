import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'

import Auth from '@/store/auth'
import Snackbar from '@/store/snackbar'
import Screen from '@/store/screen'

// eslint-disable-next-line import/no-mutable-exports
let auth: Auth
let snackbar: Snackbar
let screen: Screen

const initializeStores = (store: Store<any>): void => {
  auth = getModule(Auth, store)
  snackbar = getModule(Snackbar, store)
  screen = getModule(Screen, store)
}

export { initializeStores, auth, snackbar, screen }
