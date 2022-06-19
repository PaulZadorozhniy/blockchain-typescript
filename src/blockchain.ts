import * as crypto from 'crypto'
import Transaction from "./transaction"
import Block from "./block"

export interface IBlockchain {
  chain: Block[]
  lastBlock: Block
  inProgressBlock: Block
}

export default class Blockchain implements IBlockchain {
  public static instance = new Blockchain()
  public chain: Block[]
  public inProgressBlock: Block

  constructor() {
    this.chain = [new Block(0, '', [new Transaction(1000, 'genesis', 'PavloZadorozhnyi')])]
    this.inProgressBlock = new Block(this.lastBlock.index + 1, this.lastBlock.hash, [])
  }

  get lastBlock() {
    return this.chain[this.chain.length - 1]
  }

  private mine(block: Block): number {
    let solution = 1

    console.log('Mining PavloCoin...')

    while (true) {
      const hash = crypto.createHash('MD5')
      hash.update((block.nonce + solution).toString()).end()

      const attempt = hash.digest('hex')

      if (attempt.substr(0, 4) === '0000') {
        this.chain.push(this.inProgressBlock)

        console.log(`Solved block with solution: ${solution}. New Block number ${this.lastBlock.index} has been added to chain with hash ${this.lastBlock.hash}`)

        return solution
      }

      solution++
    }
  }

  public addTransaction(transaction: Transaction, senderPublicKey: string, signature: Buffer): void {
    this.inProgressBlock.addTransaction(transaction, senderPublicKey, signature)

    if (this.inProgressBlock.transactions.length === 10) {
      this.mine(this.inProgressBlock)

      this.inProgressBlock = new Block(this.lastBlock.index + 1, this.lastBlock.hash, [])
    }
  }
}