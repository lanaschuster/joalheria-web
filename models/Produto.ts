import Categoria from './Categoria'
import Fornecedor from './Fornecedor'

interface Produto {
  id?: string,
  name: string,
  description: string,
  code: string,
  sku?: string,
  image: string | File,
  
  quantity: number,
  unitCost: number,
  shipCost: number,
  totalCost: number,
  price: number,
  profit?: number,

  category: Categoria,
  categoryId?: string,
  provider: Fornecedor,
  providerId?: string
}

export default Produto
