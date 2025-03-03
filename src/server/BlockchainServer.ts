import express from "express";
import morgan from "morgan";
import Blockchain from "../lib/Blockchain";
import Block from "../lib/Block";
import Validation from "../lib/Validation";

const PORT = process.env.PORT || 3000;

const app = express();

/* v8 ignore start */
if (process.argv.includes("--run")){
    app.use(morgan("tiny"));
}
/* v8 ignore stop */

app.use(express.json());

const blockchain = new Blockchain();

app.get("", (req, res, next) => {
    res.json({
        numberOfBlocks: blockchain.blocks.length,
        isValid: blockchain.isValid(),
        blockchain: blockchain,
    });
});

app.get("/status", (req, res, next) => {
    res.json({
        numberOfBlocks: blockchain.blocks.length,
        isValid: blockchain.isValid(),
        lastBlock: blockchain.getLastBlock(),
    });
});

app.get("/blocks/:indexOrHash", (req, res, next) => {
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

app.post("/blocks", (req, res, next) => {
    if (!req.body.data){
        return res.sendStatus(422);
    }

    let index = blockchain.getLastBlock().index;

    index++;

    const block = new Block(index, blockchain.getLastBlock().hash, req.body.data);

    const blockValidation = block.isValid(blockchain.getLastBlock().hash, blockchain.getLastBlock().index)
    
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

export {
    app
}