const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index,data,timeStamp,prevHash){
        this.index = index;
        this.data = data;
        this.timeStamp = timeStamp;
        this.prevHash = prevHash;
        this.hash = this.computeHash();
    }

    computeHash(){
        return SHA256(this.index + JSON.stringify(this.data)+this.timeStamp+this.prevHash).toString();
    }
}

module.exports = Block;