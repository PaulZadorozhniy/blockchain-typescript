import * as crypto from 'crypto'
import Transaction from "./transaction"

export interface IBlock {
  index: number
  hash: string
  previousHash: string
  nonce: number
  transactions: Transaction[]
  addTransaction(transaction: Transaction, senderPublicKey: string, signature: Buffer): void
}

export default class Block implements IBlock {
  constructor(
    public index: number,
    public previousHash: string,
    public transactions: Transaction[],
    public timestamp: number = Date.now(),
    public nonce: number = Math.round(Math.random() * 9999999999)
  ) { }

  get hash() {
    const str = JSON.stringify(this)
    const hash = crypto.createHash('SHA256')

    hash.update(str).end()

    return hash.digest('hex')
  }

  public addTransaction(transaction: Transaction, senderPublicKey: string, signature: Buffer): void {
    const verifier = crypto.createVerify('SHA256')
    verifier.update(transaction.toString())

    const isValid = verifier.verify(senderPublicKey, signature)

    if (!isValid) {
      console.log('Transaction validation failed')
    }

    this.transactions.push(transaction)
    console.log(`Transaction has been succesefully added to current block`)
  }
}
