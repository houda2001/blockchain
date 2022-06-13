var Block = require('./block');

class Blockchain{
    constructor(blockchainArray){
        this.blockchain = blockchainArray || [this.startGenesisBlock()];
    }

    startGenesisBlock(){
        return new Block(0,{name:"genesis"},"","0");
    }

    latestBlock(){
        return this.blockchain[Number(this.blockchain.length)-1];
    }

    addNewBlock(newBlock){
        newBlock.index = this.blockchain.length;
        newBlock.prevHash = this.latestBlock().hash;
        newBlock.hash = newBlock.computeHash();
        this.blockchain.push(newBlock);
    }

    checkValidity(){
        // Checking validity
        for(let i = 1; i < this.blockchain.length; i++) {
                const currentBlock = this.blockchain[i];
                const nextBlock= this.blockchain[i-1];
            // Checking current blcok hash
            
            if(currentBlock.hash !== currentBlock.computeHash()) {
                return false;
            }
            // Comparing current block hash with the next block
        
            if(currentBlock.prevHash !== nextBlock.hash) {
                return false;
            }
            return true;
        }
    }

    verifyData(index, data){

    }

}

export default Blockchain;