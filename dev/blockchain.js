const sha256=require('sha256');
const currNodeUrl=process.argv[3];
const uuid=require('uuid/v1');

class Blockchain{
    
    constructor(){
        this.chain=[];
        this.pendingTransactions=[];
        this.currNodeUrl=currNodeUrl;
        // list of registerd nodes
        this.networkNodes=[];
        // genesis block (ie. first block which has arbitrary nonce, previousHash and hash)
        this.createBlock(100,'0','0000');
    }

    createBlock(nonce,previousBlockHash,hash){
        const block={
            index: this.chain.length+1,
            hash: hash,
            previousBlockHash: previousBlockHash,
            nonce: nonce,
            timestamp: Date.now(),
            transactions: this.pendingTransactions
        };
        this.pendingTransactions=[];
        this.chain.push(block);
        return block;
    }

    getLastBlock(){
        return this.chain[this.chain.length-1];
    }

    createNewTransactions(amnt,sender,receiver){
        const newTransaction={
            amount:amnt,
            sender:sender,
            receiver:receiver,
            transactionId:uuid().split('-').join('')
        };
        return newTransaction;
    }

    addTransactionsToPendingTransactions(transactionObj){
        this.pendingTransactions.push(transactionObj);
        return this.getLastBlock()['index']+1;
    }

    chainIsValid(blockchain){
        let validChain=true;
        
        for(var i=1;i<blockchain.length;i++){
            const currBlock=blockchain[i];
            const prevBlock=blockchain[i-1];
            const blockHash=this.hashBlock(prevBlock['hash'],{transactions:currBlock['transactions'],index:currBlock['index']},currBlock['nonce']);
            if(currBlock['previousBlockHash']!==prevBlock['hash'])
                validChain=false;
            if(blockHash.substring(0,4)!=='0000')
                validChain=false;
        };
        const genesisBlock=blockchain[0];
        const correctTransactions=genesisBlock['transactions'].length===0;
        const correctNonce=genesisBlock['nonce']===100;
        const correctPrevHash=genesisBlock['previousBlockHash']==='0';
        const correctHash=genesisBlock['hash']==='0000';
        
        if(!correctTransactions||!correctNonce||!correctPrevHash||!correctHash)
            validChain=false;
        
        return validChain;
    }

    hashBlock(previousBlockHash,currBlockData,nonce){
        const dataArray=previousBlockHash+nonce.toString()+JSON.stringify(currBlockData);
        const hash=sha256(dataArray);
        return hash;
    }

    proofOfWork(previousBlockHash,currBlockData){
        let nonce=0;
        let hash=this.hashBlock(previousBlockHash,currBlockData,nonce);
        while(hash.substring(0,4)!=='0000'){
            nonce++;
            hash=this.hashBlock(previousBlockHash,currBlockData,nonce);
        }
        return nonce;
    }

    getBlock(blockHash){
        let correctHash=null;
        this.chain.forEach(block=>{
            if(block.hash===blockHash)
                correctHash=block;
        });
        return correctHash;
    }

    getTransaction(transactionId){
        let correctTransaction=null;
        let correctBlock=null;
        this.chain.forEach(block=>{
            block.transactions.forEach(transaction=>{
                if(transaction.transactionId===transactionId){
                    correctTransaction=transaction;
                    correctBlock=block;
                };
            });
        });
        return{
            transaction:correctTransaction,
            block:correctBlock
        };
    };

    getAdressData(address){
        const addressTransactions=[];
        this.chain.forEach(block=>{
            block.transactions.forEach(transaction=>{
                if(transaction.sender===address||transaction.receiver===address)
                    addressTransactions.push(transaction);
            });
        });
        let balance=0;
        addressTransactions.forEach(transaction=>{
            if(transaction.receiver===address)
                balance+=transaction.amount;
            else if(transaction.sender===address)
                balance-=transaction.amount;
        });
        return {
            addressTransactions:addressTransactions,
            addressBalance:balance
        };
    }


}

module.exports=Blockchain