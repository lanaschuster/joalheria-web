import DiscountType from './DiscountType'
import SaleStatus from './SaleStatus'


interface Sale {
  id?: number,
  total: number,
  shipCost: number,
  discount: number,
  clientName: string,
  clientEmail: string,
  obs?: string,
  discountType: DiscountType,
  status: SaleStatus
}

export default Sale
