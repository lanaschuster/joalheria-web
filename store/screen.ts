import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Mode } from '@/models'

@Module({ name: 'screen', stateFactory: true, namespaced: true })
export default class Screen extends VuexModule {
  private mode: Mode = Mode.VIEW

  public get $mode() {
    return this.mode
  }

  @Mutation
  private SET_MODE(mode: Mode) {
    this.mode = mode
  }

  @Action
  public setMode(mode: Mode) {
    this.context.commit('SET_MODE', mode)
  }

}
