import * as crypto from 'crypto'

class Transaction {
  constructor(
    public amount: number,
    public payerPublicKey: string,
    public payeePublicKey: string
  ) { }

  toString() {
    return JSON.stringify(this)
  }
}

class Block {

  public nonce = Math.round(Math.random() * 9999999999)

  constructor(
    public prevHash: string,
    public transaction: Transaction,
    public ts = Date.now()
  ) { }

  get hash() {
    const str = JSON.stringify(this)
    const hash = crypto.createHash('SHA256')

    hash.update(str).end()

    return hash.digest('hex')
  }
}

class Chain {
  public static instance = new Chain()
  public chain: Block[]

  constructor() {
    this.chain = [new Block('', new Transaction(1000, 'genesis', 'PavloZadorozhnyi'))]
  }

  get lastBlock() {
    return this.chain[this.chain.length - 1]
  }

  mine(nonce: number) {
    let solution = 1

    console.log('Mining PavloCoin...')

    while (true) {
      const hash = crypto.createHash('MD5')
      hash.update((nonce + solution).toString()).end()

      const attempt = hash.digest('hex')

      if (attempt.substr(0, 4) === '0000') {
        console.log(`Solved block with solution: ${solution}`)

        return solution
      }

      solution++
    }
  }

  addBlock(transaction: Transaction, senderPublicKey: string, signature: Buffer) {
    const verifier = crypto.createVerify('SHA256')
    verifier.update(transaction.toString())

    const isValid = verifier.verify(senderPublicKey, signature)

    if (isValid) {
      const newBlock = new Block(this.lastBlock.hash, transaction)
      this.mine(newBlock.nonce)
      this.chain.push(newBlock)
    }
  }
}

class Wallet {
  public publicKey: string
  public privateKey: string

  constructor() {
    const keypair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    })

    this.privateKey = keypair.privateKey
    this.publicKey = keypair.publicKey
  }

  sendMoney(amount: number, payeePublicKey: string) {
    const transaction = new Transaction(amount, this.publicKey, payeePublicKey)

    const sign = crypto.createSign('SHA256')
    sign.update(transaction.toString()).end()

    const signature = sign.sign(this.privateKey)
    Chain.instance.addBlock(transaction, this.publicKey, signature)
  }
}

const wallet1 = new Wallet()
const wallet2 = new Wallet()
const wallet3 = new Wallet()

wallet1.sendMoney(10, wallet2.publicKey)
wallet1.sendMoney(20, wallet3.publicKey)
wallet1.sendMoney(10, wallet1.publicKey)

console.log(Chain.instance)