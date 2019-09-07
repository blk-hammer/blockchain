// express config and middleware for accessing data from post req
const bodyParser=require('body-parser');
const express = require('express');
const app = express();
// getting the port no of node;
const port = process.argv[2];
// request handler library
const rp=require('request-promise');
// creating unique string (used for unique address of each node)
const uuid=require('uuid/v1');
const nodeAddress=uuid().split('-').join('');
// configuring body parser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// creating instance
const Blockchain=require('./blockchain');
const bitcoin=new Blockchain;


app.get('/block-explorer',(req,res)=>{
    res.sendFile('./block-explorer/index.html',{root:__dirname});
});

app.get('/blockchain', (req, res) =>
    res.send(bitcoin)
);

app.post('/transaction', (req, res) =>{
    const newTransaction=req.body;
    const blockNo=bitcoin.addTransactionsToPendingTransactions(newTransaction);
    res.json({note:`the transaction will be added in block ${blockNo}`});
});

app.post('/transaction/broadcast', (req, res) =>{
    const newTransaction=bitcoin.createNewTransactions(req.body.amount,req.body.sender,req.body.receiver);
    bitcoin.addTransactionsToPendingTransactions(newTransaction);
    const transactionPromises=[];
    bitcoin.networkNodes.forEach(networkNodeUrl=>{
        const requestOptions={
            uri:networkNodeUrl+'/transaction',
            method:'POST',
            body:newTransaction,
            json:true
        };
        transactionPromises.push(rp(requestOptions));
    });
    Promise.all(transactionPromises)
    .then(data=>{
        res.json({note:'transaction created and broadcasted successfully'});
    });

});


app.get('/mine', (req, res) =>{ 
    const lastBlock=bitcoin.getLastBlock();
    const previousBlockHash=lastBlock['hash'];
    const currentBlockData={
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index']+1
    };
    const nonce=bitcoin.proofOfWork(previousBlockHash,currentBlockData);
    const blockHash=bitcoin.hashBlock(previousBlockHash,currentBlockData,nonce);
    // reward for mining a block (bitcoin ka backbone)
    // bitcoin.createNewTransactions(12.5,"00",nodeAddress);
    const newBlock=bitcoin.createBlock(nonce,previousBlockHash,blockHash);
    
    const requestPromises=[];
    bitcoin.networkNodes.forEach(networkNodeUrl=>{
        const requestOptions={
            uri: networkNodeUrl+'/receive-new-block',
            method: 'POST',
            body: {newBlock:newBlock},
            json: true
        };
        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
    // this is for giving the reward of mining 
    // (which is added as a transaction in pending transaction array after block is mined)
    .then(()=>{
        const requestOptions={
            uri:bitcoin.currNodeUrl+'/transaction/broadcast',
            method:'POST',
            body:{
                amount:12,
                sender:00,
                receiver:nodeAddress
            },
            json:true
        };
        return rp(requestOptions);
    })
    .then(()=>{
        res.json({
            note:'block mined and broadcasted succesfully',
            block:newBlock
        });
    });
});

app.get('/consensus', (req,res) =>{
    const requestPromises=[];
    bitcoin.networkNodes.forEach(networkNodeUrl=>{
        const requestOptions={
            uri: networkNodeUrl+'/blockchain',
            mehtod:'GET',
            json:true
        };
        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
    .then(blockchains=>{
        const currChainLenght=bitcoin.chain.length;
        let maxChainLength=currChainLenght;
        let newLongestChain=null;
        let newPendingtransactions=null;
        blockchains.forEach(blockchain=>{
            if(blockchain.chain.length>maxChainLength){
                maxChainLength=blockchain.chain.length;
                newLongestChain=blockchain.chain;
                newPendingtransactions=blockchain.pendingTransactions;
            };
        });
        if(!newLongestChain||newLongestChain&&!bitcoin.chainIsValid(newLongestChain)){
            res.json({
                note:'current chain has not been replaced',
                chain:bitcoin.chain
            });
        }
        else //if(newLongestChain&&bitcoin.chainIsValid(newLongestChain))
        {
            bitcoin.chain=newLongestChain;
            bitcoin.pendingTransactions=newPendingtransactions;
            res.json({
                note:'this chain has been replaced',
                chain:bitcoin.chain
            });
        }
    });
});

app.post('/receive-new-block', (req, res) =>{
    const newBlock=req.body.newBlock;
    const lastBlock=bitcoin.getLastBlock();
    const correctHash=lastBlock.hash===newBlock.previousBlockHash;
    const correctIndex=lastBlock['index']+1===newBlock['index'];
    if(correctHash && correctIndex){
        bitcoin.chain.push(newBlock);
        bitcoin.pendingTransactions=[];
        res.json({
            note:'new block recieved and accepted',
            newBlock:newBlock
        });
    }
    else{
        res.json({
            note:'new block rejected',
            newBlock:newBlock
        });
    }
});


app.post('/register-and-broadcast-node', (req, res) =>{
    const newNodeUrl=req.body.newNodeUrl;
    if(bitcoin.networkNodes.indexOf(newNodeUrl)==-1)
        bitcoin.networkNodes.push(newNodeUrl);
    
    const regNodesPromises=[];
    bitcoin.networkNodes.forEach(networkNodeUrl =>{
        const requestOptions={
            uri: networkNodeUrl+'/register-node',
            method:'POST',
            body: {newNodeUrl:newNodeUrl},
            json: true
        };
        regNodesPromises.push(rp(requestOptions));
    });
    console.log(regNodesPromises.length);
    Promise.all(regNodesPromises)
    .then(() =>{
        const bulkRegisterOptions={
            uri: newNodeUrl+'/register-node-bulk',
            method: 'POST',
            body: {allNetworkNodes:[...bitcoin.networkNodes,bitcoin.currNodeUrl]},
            json: true
        };
        return rp(bulkRegisterOptions);
    })
    .catch(data=>{
        console.log(data);
        res.json({note: 'couldnt bulk register'});
    })
    .then(()=>{
        res.json({note:'New node registered with network successfully'});
    });
    
});

app.post('/register-node', (req, res) =>{
    const newNodeUrl=req.body.newNodeUrl;
    if(bitcoin.networkNodes.indexOf(newNodeUrl)==-1 && bitcoin.currNodeUrl!==newNodeUrl)
        bitcoin.networkNodes.push(newNodeUrl);
    res.json({note:'new node registered succesfully'});
});

app.post('/register-node-bulk', (req, res) =>{
    const allNetworkNodes=req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeUrl=>{
        if(bitcoin.networkNodes.indexOf(networkNodeUrl)==-1 && bitcoin.currNodeUrl!==networkNodeUrl)
            bitcoin.networkNodes.push(networkNodeUrl);
    });
    res.json({note:'bulk registration successful'});
});

// query in the blockchain
app.get('/block/:blockHash',(req,res)=>{
    const blockHash=req.params.blockHash;
    const correctBlock=bitcoin.getBlock(blockHash);
    res.json({
        block:correctBlock
    });
});

app.get('/transaction/:transactionId',(req,res)=>{
    const transactionId=req.params.transactionId;
    const transactionData=bitcoin.getTransaction(transactionId);
    res.json({
        transaction:transactionData.transaction,
        block:transactionData.block
    });
});

app.get('/address/:address',(req,res)=>{
    const address=req.params.address;
    const addressData=bitcoin.getAdressData(address);
    res.json({
        addressData :addressData
    });
});


app.listen(port, () => console.log(`app.js listening on port ${port}!`));