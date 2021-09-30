import DiscountType from './DiscountType'
import Produto from './Produto'

interface SaleItem {
  id?: string,
  quantity: number,
  price: number,
  discount: number,
  total: number,
  saleId?: string,
  productId?: string,
  produto?: Produto,
  discountType: DiscountType
}

export default SaleItem
