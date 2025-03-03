import Block from "./Block";
import Validation from "../Validation";

/**
 * Blockchain class
 */
export default class Blockchain {

    blocks: Block[];
    nextIndex: number = 0;

    /**
     * Inicialize mocked blockchain with genesis block
     */
    constructor() {
        this.blocks = [new Block(this.nextIndex, "", "Genesis Block")];
        this.nextIndex++;
    }

    /**
     * Return the lastes mocked block
     */
    getLastBlock() : Block {
        return this.blocks[this.blocks.length-1];
    }

    getBlock(hash: string) : Block | undefined {
        return this.blocks.find(block => block.hash === hash);
    }


    /**
     * Check if the mocked blockchain is valid
     */
    isValid() : Validation {

        for(let i = this.blocks.length-1; i > 0; i--){
            const currentBlock = this.blocks[i];
            const previousBlock = this.blocks[i-1];

            const validation = currentBlock.isValid(previousBlock.hash, previousBlock.index);

            if(!validation.success){
                return new Validation(false, `Invalid block [${currentBlock.index}]: ${validation.message}`);
            }
        }

        return new Validation();
    }

    /**
     * Add new mocked block 
     * @param block block that will be added 
     * @returns whether the add was successful or not
     */
    addBlock(block: Block) : Validation {
        if(block.index <= 0){
            return new Validation(false, "Invalid mock block");
        }
        
        this.blocks.push(block);
        this.nextIndex++;
        
        return new Validation();
    }

}