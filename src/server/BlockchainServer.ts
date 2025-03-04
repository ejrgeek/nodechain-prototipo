import dotenv from "dotenv";
dotenv.config();

import express, {Request, Response, NextFunction} from "express";
import morgan from "morgan";
import Blockchain from "../lib/Blockchain";
import Block from "../lib/Block";
import Transaction from "../lib/Transaction";

/* v8 ignore start */
const PORT = parseInt(`${process.env.BLOCKCHAIN_PORT || 3000}`);
/* v8 ignore stop */

const app = express();

/* v8 ignore start */
if (process.argv.includes("--run")){
    app.use(morgan("tiny"));
}
/* v8 ignore stop */

app.use(express.json());

const blockchain = new Blockchain();

app.get("", (req: Request, res: Response, next: NextFunction) => {
    res.json({
        numberOfBlocks: blockchain.blocks.length,
        isValid: blockchain.isValid(),
        blockchain: blockchain,
    });
});

app.get("/status", (req: Request, res: Response, next: NextFunction) => {
    res.json({
        numberOfMempool: blockchain.mempool.length,
        numberOfBlocks: blockchain.blocks.length,
        isValid: blockchain.isValid(),
        lastBlock: blockchain.getLastBlock(),
    });
});

app.get("/blocks/next", (req: Request, res: Response, next: NextFunction) => {
    return res.json(blockchain.getNextBlock());
});

app.get("/blocks/:indexOrHash", (req: Request, res: Response, next: NextFunction) => {
    let block;
    if(/^[0-9]+$/.test(req.params.indexOrHash)){
        block = blockchain.blocks[parseInt(req.params.indexOrHash)];
    } else {
        block = blockchain.getBlock(req.params.indexOrHash);
    }

    if (block){
        return res.json(block);
    } else {
        return res.sendStatus(404);
    }

});

app.get("/transactions/:hash?", (req: Request, res: Response, next: NextFunction) => {
    if(req.params.hash){
        return res.json(blockchain.getTransaction(req.params.hash));
    }

    return res.json({
        next: blockchain.mempool.slice(0, Blockchain.MAX_TX_PER_BLOCK),
        total: blockchain.mempool.length,
    });

});

app.post("/blocks", (req: Request, res: Response, next: NextFunction) => {

    if (!req.body.transactions){
        return res.sendStatus(422);
    }
    
    let index = blockchain.getLastBlock().index;

    index++;

    const blockTxs = req.body.transactions.map((tx: any) => 
        new Transaction({
            type: tx.type, 
            timestamp: tx.timestamp, 
            data: tx.data, 
            hash: tx.hash
        } as Transaction)
    );
    const block = new Block(index, blockchain.getLastBlock().hash, blockTxs, req.body.miner, req.body.nonce);


    const blockValidation = block.isValid(blockchain.getLastBlock().hash, blockchain.getLastBlock().index, blockchain.getDifficulty());
    
    /* v8 ignore start */
    if (!blockValidation.success) { 
        return res.status(422).send({
            "message": blockValidation.message
        });
    }
    /* v8 ignore stop */

    const valid = blockchain.addBlock(block);

    if(valid){
        return res.status(201).json({
            numberOfBlocks: blockchain.blocks.length,
            isValid: blockchain.isValid(),
            lastBlock: blockchain.getLastBlock(),
        });
    }
    

});

app.post("/transactions", (req: Request, res: Response, next: NextFunction) => {
    if (req.body.hash === undefined){
        return res.sendStatus(422);
    }

    const tx = new Transaction(req.body as Transaction);

    const validation = blockchain.addTransaction(tx);

    if(validation.success){
        res.status(201).json(tx);
    } else {
        res.status(422).json(validation);
    }

});


/* v8 ignore start */
if (process.argv.includes("--run")) {
    app.listen(PORT, () => {
        console.log(`Blockchain server is running at ${PORT}`);
    });
}
/* v8 ignore stop */

export {
    app
}