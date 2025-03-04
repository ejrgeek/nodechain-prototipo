import Block from "../src/lib/Block";
import Blockchain from "../src/lib/Blockchain";
import Transaction from "../src/lib/Transaction";

jest.mock('../src/lib/Block')
jest.mock("../src/lib/Transaction");

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
        const newBlock = new Block(1, blockchain.blocks[0].hash, [new Transaction({
                    data: "Block 2",
                } as Transaction)]);
        const valid = blockchain.addBlock(newBlock);

        expect(valid.success).toEqual(true);
    });

    test("Should not add block (invalid block)", () => {
        const blockchain = new Blockchain();
        const valid = blockchain.addBlock(new Block(-1, "", [new Transaction({
            data: "Block 2",
        } as Transaction)]));

        expect(valid.success).toBeFalsy();
    });

    test("Should not blockchain valid (fake block)", () => {
        const blockchain = new Blockchain();
        const newBlock = new Block(-1, blockchain.blocks[0].hash, [new Transaction({
            data: "Block 2",
        } as Transaction)]);
        blockchain.blocks.push(newBlock);

        const valid = blockchain.isValid();

        expect(valid.success).toBeFalsy();
    });

    test("Should get next block info", () => {
        const blockchain = new Blockchain();
        const info = blockchain.getNextBlock();
        expect(info?.index).toEqual(1);
    });

});