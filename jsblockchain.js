const SHA256 = require("crypto-js/sha224")

class Transaction {
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = "0"){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    calculateHash(){
        // we will be using SHA256 cryptographic function to generate the hash of this block
        return SHA256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.transactions)+this.nonce).toString();
    }
    mineNewBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("A new block was mined with hash " + this.hash);
    }
}
class Blockchain {
    constructor(){
        //the first variable of the array will be the genesis block, created manually
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
        this.pendingTransactions = [];
        this.miningReward = 10
    }
    createGenesisBlock(){
        return new Block("14/08/2021", "This is the genesis block", "0")
    }
    getLatestBlock(){
        return this.chain[this.chain.length - 1]
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineNewBlock(this.difficulty)
        console.log("Block mined successfully");

        this.chain.push(block)
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ]
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance = balance - trans.amount;
                }
                if(trans.toAddress === address){
                    balance = balance + trans.amount;
                }
            }
        }

        return balance;

    }

    checkBlockChainValidity(){
        //console.log(this.chain[1]);

        for(let i = 1 ; i < this.chain.length ; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}


//create a new block chain
let myBlockchain = new Blockchain();

let trans1 = new Transaction("tom", "jerry", 100)
myBlockchain.createTransaction(trans1)

let trans2 = new Transaction("jerry", "tom", 30)
myBlockchain.createTransaction(trans2)

console.log("started mining by the miner...");
myBlockchain.minePendingTransactions("donald")

console.log("balance for tom is: " + myBlockchain.getBalanceOfAddress("tom"));
console.log("balance for jerry is: " + myBlockchain.getBalanceOfAddress("jerry"));

console.log("started mining again by the miner...");
myBlockchain.minePendingTransactions("donald")

console.log("balance for donald is: " + myBlockchain.getBalanceOfAddress("donald"));
