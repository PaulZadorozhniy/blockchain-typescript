import Wallet from "./wallet"

const wallet1 = new Wallet()
const wallet2 = new Wallet()

setInterval(() => {
  wallet1.sendMoney(10, wallet2.publicKey)
}, 100)