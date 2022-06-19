export interface ITransaction {
  amount: number,
  payerPublicKey: string,
  payeePublicKey: string
}

export default class Transaction implements ITransaction {
  constructor(
    public amount: number,
    public payerPublicKey: string,
    public payeePublicKey: string
  ) { }

  toString() {
    return JSON.stringify(this)
  }
}
