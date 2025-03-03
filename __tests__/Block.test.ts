import Block from "../src/lib/Block";

describe("Block Tests", () => {

    const difficulty = 0;
    const miner = "ejrgeek";
    let genesis: Block;

    beforeAll(() => {
        genesis = new Block(0, "", "Genesis Block")
    });

    test("Should not be valid (invalid index)", () => {
        const block = new Block(-1, genesis.hash, "Block 2");
        block.minePoW(difficulty, miner);
        const valid = block.isValid(genesis.hash, genesis.index, difficulty);

        expect(valid.success).toBeFalsy();
    });
    
    test("Should not be valid (no data)", () => {
        const block = new Block(1, genesis.hash, "");
        block.minePoW(difficulty, miner);
        const valid = block.isValid(genesis.hash, genesis.index, difficulty);

        expect(valid.success).toBeFalsy();
    });
    
    test("Should not be valid (previous hash)", () => {
        const block = new Block(1, "asd", "Genesis Block");
        block.minePoW(difficulty, miner);
        const valid = block.isValid(genesis.hash, genesis.index, difficulty);

        expect(valid.success).toBeFalsy();
    });
    
    test("Should not be valid (invalid timestamp)", () => {
        const block = new Block(1, genesis.hash, "Genesis Block");
        block.timestamp = 0;
        block.minePoW(difficulty, miner);
        const valid = block.isValid(genesis.hash, genesis.index, difficulty);

        expect(valid.success).toBeFalsy();
    });
    
    test("Should not be valid (empty hash)", () => {
        const block = new Block(1, genesis.hash, "Second Block");
        block.minePoW(difficulty, miner);
        block.hash = "";
        const valid = block.isValid(genesis.hash, genesis.index, difficulty);
        expect(valid.success).toBeFalsy();
    });
    
    test("Should not be valid (no mined)", () => {
        const block = new Block(1, genesis.hash, "Genesis Block 2");
        block.hash = "";
        const valid = block.isValid(genesis.hash, genesis.index, difficulty);
        expect(valid.success).toBeFalsy();
    });
    
    test("Should be valid", () => {
        const block = new Block(1, genesis.hash, "New Block");
        block.minePoW(difficulty, miner);
        const valid = block.isValid(genesis.hash, genesis.index, difficulty);

        expect(valid.success).toBeTruthy();
    });

});