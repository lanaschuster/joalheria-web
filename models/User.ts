import Role from './Role'

interface User {
  id?: string,
  name: string,
  lastName: string,
  email: string,
  password: string,
  isEmailVerified: string,
  avatar: string,
  isActive: boolean,
  role: Role,
  roleId?: number
}

export default User
