import Block from "../src/lib/Block";
import Blockchain from "../src/lib/Blockchain";
import Transaction from "../src/lib/Transaction";
import TransactionInput from "../src/lib/TransactionInput";

jest.mock('../src/lib/Block')
jest.mock("../src/lib/Transaction");
jest.mock("../src/lib/TransactionInput");

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

        const tx = new Transaction({
            txInput: new TransactionInput(),
        } as Transaction);

        blockchain.mempool.push(tx);

        const newBlock = new Block(1, blockchain.blocks[0].hash, [tx]);
        const valid = blockchain.addBlock(newBlock);

        expect(valid.success).toEqual(true);
    });


    test("Should add Transaction", () => {
        const blockchain = new Blockchain();

        const tx = new Transaction({
            txInput: new TransactionInput(),
            hash: "tx1"
        } as Transaction);

        const validation = blockchain.addTransaction(tx);

        expect(validation.success).toEqual(true);
    });


    test("Should GET Transaction (HASH - BLOCKS)", () => {
        const blockchain = new Blockchain();

        const tx = new Transaction({
            txInput: new TransactionInput(),
            hash: "tx1"
        } as Transaction);

        const block = new Block(1, blockchain.blocks[0].hash, [tx]);

        blockchain.blocks.push(block);

        const txSearched = blockchain.getTransaction(tx.hash);

        expect(txSearched.blockIndex).toBeGreaterThanOrEqual(0);
    });

    test("Should GET Transaction (HASH - MEMPOOL)", () => {
        const blockchain = new Blockchain();

        const tx = new Transaction({
            txInput: new TransactionInput(),
            hash: "tx1"
        } as Transaction);

        blockchain.addTransaction(tx);

        const txSearched = blockchain.getTransaction(tx.hash);

        expect(txSearched.mempoolIndex).toBeGreaterThanOrEqual(0);
    });

    test("Should NOT GET Transaction", () => {
        const blockchain = new Blockchain();

        const tx = new Transaction({
            txInput: new TransactionInput(),
            hash: "tx1"
        } as Transaction);

        blockchain.addTransaction(tx);

        const txSearched = blockchain.getTransaction("as");

        expect(txSearched.mempoolIndex).toBe(-1);
        expect(txSearched.blockIndex).toBe(-1);
    });

    test("Should NOT add Transaction (duplicated blockchain)", () => {
        const blockchain = new Blockchain();

        const tx = new Transaction({
            txInput: new TransactionInput(),
        } as Transaction);

        const validation = blockchain.addTransaction(tx);

        expect(validation.success).toBeFalsy();
    });

    test("Should NOT add Transaction (duplicated mempool)", () => {
        const blockchain = new Blockchain();

        const tx = new Transaction({
            txInput: new TransactionInput(),
            hash: "asdw"
        } as Transaction);

        blockchain.mempool.push(tx);
        const validation = blockchain.addTransaction(tx);

        expect(validation.success).toBeFalsy();
    });

    test("Should NOT add Transaction (invalid tx)", () => {
        const blockchain = new Blockchain();

        const tx = new Transaction();
        tx.hash = "a56s4";
        tx.txInput = new TransactionInput();
        tx.to = "";

        const validation = blockchain.addTransaction(tx);

        expect(validation.success).toBeFalsy();
    });

    test('Should NOT add block (invalid tx in mempool)', () => {
        const blockchain = new Blockchain();

        const invalidTx1 = new Transaction({ txInput: new TransactionInput(), } as Transaction);
        const invalidTx2 = new Transaction({ txInput: new TransactionInput(), } as Transaction);

        blockchain.mempool.push(invalidTx1, invalidTx2);

        const block = new Block(1, blockchain.blocks[0].hash, [invalidTx1]);

        const validation = blockchain.addBlock(block);

        expect(blockchain.mempool.length).not.toBe(blockchain.blocks.length - 1);

        expect(validation.success).toBeFalsy();

    });

    test("Should not add block (invalid block)", () => {
        const blockchain = new Blockchain();
        const valid = blockchain.addBlock(new Block(-1, "", [new Transaction({
            txInput: new TransactionInput(),
        } as Transaction)]));

        expect(valid.success).toBeFalsy();
    });

    test('Should not blockchain valid (fake block)', () => {
        const blockchain = new Blockchain();

        const fakeBlock = new Block(-1, '', []);
        blockchain.blocks.push(fakeBlock);

        const validation = blockchain.isValid();

        expect(validation.success).toBe(false);
    });

    test("Should get next block info", () => {
        const blockchain = new Blockchain();

        blockchain.mempool.push(new Transaction());

        const info = blockchain.getNextBlock();
        expect(info?.index).toEqual(1);
    });


    test("Should NOT get next block info", () => {
        const blockchain = new Blockchain();
        const info = blockchain.getNextBlock();
        expect(info).toBeNull();
    });

});