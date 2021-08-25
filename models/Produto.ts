import Categoria from './Categoria'
import Fornecedor from './Fornecedor'

interface Produto {
  id?: string,
  name: string,
  description: string,
  code: string,
  image: string,
  
  quantity: number,
  unitCost: number,
  shipCost: number,
  totalCost: number,
  price: number,

  category: Categoria,
  categoryId?: string,
  supplier: Fornecedor,
  providerId?: string
}

export default Produto
