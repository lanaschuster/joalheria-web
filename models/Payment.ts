import PaymentMethod from './PaymentMethod'

interface Payment {
  paymentMethod: PaymentMethod,
  parts: number,
  value: number,
  pay: () => {
    // TODO
  }
}

export default Payment
