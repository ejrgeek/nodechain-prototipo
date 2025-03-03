import express, {Request, Response, NextFunction} from "express";
import morgan from "morgan";
import Blockchain from "../lib/Blockchain";
import Block from "../lib/Block";

const PORT = process.env.PORT || 3000;

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

app.post("/blocks", (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.data){
        return res.sendStatus(422);
    }

    let index = blockchain.getLastBlock().index;

    index++;

    const block = new Block(index, blockchain.getLastBlock().hash, req.body.data);

    const blockValidation = block.isValid(blockchain.getLastBlock().hash, blockchain.getLastBlock().index, Blockchain.DIFFICULTY_FACTOR)
    
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