import Block from "../src/lib/model/Block";
import Blockchain from "../src/lib/model/Blockchain";

jest.mock('../src/lib/model/Block')

describe("Blockchain Testes", () => {

    test("Should has genesis blocks", () => {
        const blockchain = new Blockchain();

        expect(blockchain.blocks.length).toEqual(1);
    });

    test("Should be valid", () => {
        const blockchain = new Blockchain();

        expect(blockchain.isValid()).toBeTruthy();
    });


    test("Should get block", () => {
        const blockchain = new Blockchain();
        const block = blockchain.getBlock(blockchain.getLastBlock().hash)

        expect(block).toBeTruthy();
    });

    test("Should add block", () => {
        const blockchain = new Blockchain();
        const newBlock = new Block(1, blockchain.blocks[0].hash, "Block 2");
        const valid = blockchain.addBlock(newBlock);

        expect(valid.success).toEqual(true);
    });

    test("Should not add block (invalid block)", () => {
        const blockchain = new Blockchain();
        const valid = blockchain.addBlock(new Block(-1, "", "Block 2"));

        expect(valid.success).toBeFalsy();
    });

    test("Should not blockchain valid (fake block)", () => {
        const blockchain = new Blockchain();
        const newBlock = new Block(-1, blockchain.blocks[0].hash, "Block 2");
        blockchain.blocks.push(newBlock);

        const valid = blockchain.isValid();

        expect(valid.success).toBeFalsy();
    });

    test("Should get next block info", () => {
        const blockchain = new Blockchain();
        const info = blockchain.getNextBlock();
        expect(info.index).toEqual(1);
    });

});