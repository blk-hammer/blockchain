const Blockchain=require('./blockchain');
bitcoin=new Blockchain();
const bt1={
    "chain": [
    {
    "index": 1,
    "hash": "0000",
    "previousBlockHash": "0",
    "nonce": 100,
    "timestamp": 1566727298680,
    "transactions": []
    },
    {
    "index": 2,
    "hash": "0000f835f87019159f9d1deac7359937fc1475fa5dc7f6b336a6b16a175e074b",
    "previousBlockHash": "0000",
    "nonce": 36813,
    "timestamp": 1566727369291,
    "transactions": []
    },
    {
    "index": 3,
    "hash": "0000a3bbb67948baa00232908bf73d3cbd942ff431445b655c26c08f9666fd43",
    "previousBlockHash": "0000f835f87019159f9d1deac7359937fc1475fa5dc7f6b336a6b16a175e074b",
    "nonce": 90859,
    "timestamp": 1566727372463,
    "transactions": [
    {
    "amount": 12,
    "sender": 0,
    "receiver": "54672430c71f11e9ac6487d9943a7ba5",
    "transactionId": "7e994bc0c71f11e9ac6487d9943a7ba5"
    }
    ]
    },
    {
    "index": 4,
    "hash": "0000eedaed9ae845d1c0798a57974a0dd989e1532ba78d1da88ca5a5a1557f79",
    "previousBlockHash": "0000a3bbb67948baa00232908bf73d3cbd942ff431445b655c26c08f9666fd43",
    "nonce": 82998,
    "timestamp": 1566727375000,
    "transactions": [
    {
    "amount": 12,
    "sender": 0,
    "receiver": "54672430c71f11e9ac6487d9943a7ba5",
    "transactionId": "80764920c71f11e9ac6487d9943a7ba5"
    }
    ]
    },
    {
    "index": 5,
    "hash": "0000e6d0a8e04e150f6412ed6a990429d6caed6ff08025733c2ab035c19f79c9",
    "previousBlockHash": "0000eedaed9ae845d1c0798a57974a0dd989e1532ba78d1da88ca5a5a1557f79",
    "nonce": 40756,
    "timestamp": 1566727377426,
    "transactions": [
    {
    "amount": 12,
    "sender": 0,
    "receiver": "54672430c71f11e9ac6487d9943a7ba5",
    "transactionId": "81f9dbe0c71f11e9ac6487d9943a7ba5"
    }
    ]
    },
    {
    "index": 6,
    "hash": "00004d7bdcd2c27dd8101e3eb58425fe0f65944e517921cc80b0c0441e406ecc",
    "previousBlockHash": "0000e6d0a8e04e150f6412ed6a990429d6caed6ff08025733c2ab035c19f79c9",
    "nonce": 10451,
    "timestamp": 1566727379773,
    "transactions": [
    {
    "amount": 12,
    "sender": 0,
    "receiver": "54672430c71f11e9ac6487d9943a7ba5",
    "transactionId": "836bbb60c71f11e9ac6487d9943a7ba5"
    }
    ]
    },
    {
    "index": 7,
    "hash": "00008f66609e8e0364f71060195ac06274c052bded8b84dd7bd83d6c40b7505a",
    "previousBlockHash": "00004d7bdcd2c27dd8101e3eb58425fe0f65944e517921cc80b0c0441e406ecc",
    "nonce": 61949,
    "timestamp": 1566727381604,
    "transactions": [
    {
    "amount": 12,
    "sender": 0,
    "receiver": "54672430c71f11e9ac6487d9943a7ba5",
    "transactionId": "84d18cf0c71f11e9ac6487d9943a7ba5"
    }
    ]
    },
    {
    "index": 8,
    "hash": "0000d390e1aa2a15e520d7b665586833879388508f0033dacb01a4218a3c1bea",
    "previousBlockHash": "00008f66609e8e0364f71060195ac06274c052bded8b84dd7bd83d6c40b7505a",
    "nonce": 38055,
    "timestamp": 1566727466652,
    "transactions": [
    {
    "amount": 12,
    "sender": 0,
    "receiver": "54672430c71f11e9ac6487d9943a7ba5",
    "transactionId": "85e91770c71f11e9ac6487d9943a7ba5"
    },
    {
    "amount": 55555,
    "sender": "chotu",
    "receiver": "rishi",
    "transactionId": "afb04830c71f11e9ac6487d9943a7ba5"
    },
    {
    "amount": 5555,
    "sender": "chotu",
    "receiver": "rishi",
    "transactionId": "b266b5a0c71f11e9ac6487d9943a7ba5"
    },
    {
    "amount": 55,
    "sender": "chotu",
    "receiver": "rishi",
    "transactionId": "b4678eb0c71f11e9ac6487d9943a7ba5"
    }
    ]
    }
    ],
    "pendingTransactions": [
    {
    "amount": 12,
    "sender": 0,
    "receiver": "54672430c71f11e9ac6487d9943a7ba5",
    "transactionId": "b89a62f0c71f11e9ac6487d9943a7ba5"
    }
    ],
    "currNodeUrl": "http://localhost:3001",
    "networkNodes": []
    }

console.log('VALID: ',bitcoin.chainIsValid(bt1.chain));