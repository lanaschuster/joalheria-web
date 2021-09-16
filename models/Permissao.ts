import Action from './Action'
import Module from './Module'

interface Permissao {
  id?: number,
  createdAt?: string,
  updatedAt?: string,
  version?: number,
  roleId?: number,
  action: Action,
  module: Module,
}

export default Permissao
