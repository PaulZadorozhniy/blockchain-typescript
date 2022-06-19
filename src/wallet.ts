import * as crypto from 'crypto'
import Transaction from './transaction'
import Blockchain from './blockchain'

interface IWallet {
  publicKey: string
  sendMoney(amount: number, payeePublicKey: string): void
}


export default class Wallet implements IWallet {
  public publicKey: string
  private privateKey: string

  constructor() {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    })

    this.privateKey = privateKey
    this.publicKey = publicKey
  }

  public sendMoney(amount: number, payeePublicKey: string): void {
    const transaction = new Transaction(amount, this.publicKey, payeePublicKey)

    const sign = crypto.createSign('SHA256')
    sign.update(transaction.toString()).end()

    const signature = sign.sign(this.privateKey)
    Blockchain.instance.addTransaction(transaction, this.publicKey, signature)
  }
}