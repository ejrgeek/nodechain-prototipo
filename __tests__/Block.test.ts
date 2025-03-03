import Block from "../src/lib/Block";

describe("Block Tests", () => {

    let genesis: Block;

    beforeAll(() => {
        genesis = new Block(0, "", "Genesis Block")
    });

    test("Should not be valid (invalid index)", () => {
        const block = new Block(-1, genesis.hash, "Block 2");
        const valid = block.isValid(genesis.hash, genesis.index);

        expect(valid.success).toBeFalsy();
    });
    
    test("Should not be valid (no data)", () => {
        const block = new Block(1, genesis.hash, "");
        const valid = block.isValid(genesis.hash, genesis.index);

        expect(valid.success).toBeFalsy();
    });
    
    test("Should not be valid (previous hash)", () => {
        const block = new Block(1, "asd", "Genesis Block");
        const valid = block.isValid(genesis.hash, genesis.index);

        expect(valid.success).toBeFalsy();
    });
    
    test("Should not be valid (invalid timestamp)", () => {
        const block = new Block(1, genesis.hash, "Genesis Block");
        block.timestamp = 0;
        const valid = block.isValid(genesis.hash, genesis.index);

        expect(valid.success).toBeFalsy();
    });
    
    test("Should not be valid (invalid hash)", () => {
        const block = new Block(1, "asd", "Genesis Block");
        block.hash = "";
        const valid = block.isValid(genesis.hash, genesis.index);

        expect(valid.success).toBeFalsy();
    });
    
    test("Should be valid", () => {
        const block = new Block(1, genesis.hash, "New Block");
        const valid = block.isValid(genesis.hash, genesis.index);

        expect(valid.success).toBeTruthy();
    });

});