import BlockInfo from "../src/lib/interfaces/BlockInfo";
import Block from "../src/lib/Block";
import Transaction from "../src/lib/Transaction";
import TransactionTypeEnum from "../src/lib/enum/TransactionTypeEnum";


jest.mock("../src/lib/Transaction");

describe("Block Tests", () => {

    const difficulty = 0;
    const miner = "ejrgeek";
    let genesis: Block;

    beforeAll(() => {
        genesis = new Block(0, "", [new Transaction({
            data: "Genesis Block",
            type: TransactionTypeEnum.FEE,
        } as Transaction)])
    });

    test("Should not be valid (invalid index)", () => {
        const block = new Block(-1, genesis.hash, [new Transaction({
            data: "Block 2",
        } as Transaction)]);
        block.minePoW(difficulty, miner);
        const valid = block.isValid(genesis.hash, genesis.index, difficulty);

        expect(valid.success).toBeFalsy();
    });

    test("Should not be valid (no data)", () => {
        const block = new Block(1, genesis.hash);
        block.minePoW(difficulty, miner);
        const valid = block.isValid(genesis.hash, genesis.index, difficulty);

        expect(valid.success).toBeFalsy();
    });

    test("Should not be valid (previous hash)", () => {
        const block = new Block(1, "asd", [new Transaction({
            data: "Block 2",
        } as Transaction)]);
        block.minePoW(difficulty, miner);
        const valid = block.isValid(genesis.hash, genesis.index, difficulty);

        expect(valid.success).toBeFalsy();
    });

    test("Should not be valid (invalid timestamp)", () => {
        const block = new Block(1, genesis.hash, [new Transaction({
            data: "Block 2",
        } as Transaction)]);
        block.timestamp = 0;
        block.minePoW(difficulty, miner);
        const valid = block.isValid(genesis.hash, genesis.index, difficulty);

        expect(valid.success).toBeFalsy();
    });

    test("Should not be valid (empty hash)", () => {
        const block = new Block(1, genesis.hash, [new Transaction({
            data: "Block 2",
        } as Transaction)]);
        block.minePoW(difficulty, miner);
        block.hash = "";
        const valid = block.isValid(genesis.hash, genesis.index, difficulty);
        expect(valid.success).toBeFalsy();
    });

    test("Should not be valid (no mined)", () => {
        const block = new Block(1, genesis.hash, [new Transaction({
            data: "Block 2",
        } as Transaction)]);
        block.hash = "";
        const valid = block.isValid(genesis.hash, genesis.index, difficulty);
        expect(valid.success).toBeFalsy();
    });

    test("Should not be valid (too many fees)", () => {

        const tx1 = new Transaction({
            data: "Block 2",
            type: TransactionTypeEnum.FEE
        } as Transaction);

        const tx2 = new Transaction({
            data: "Block 3",
            type: TransactionTypeEnum.FEE
        } as Transaction);

        const block = new Block(1, genesis.hash, [tx1, tx2]);
        const valid = block.isValid(genesis.hash, genesis.index, difficulty);
        expect(valid.success).toBeFalsy();
    });

    test("Should not be valid (too many fails)", () => {

        const tx1 = new Transaction({
            data: "Block 2",
            type: TransactionTypeEnum.FEE
        } as Transaction);

        const tx2 = new Transaction({
            data: "Block 3",
        } as Transaction);

        tx1.hash = "";
        tx2.data = "";

        const block = new Block(1, genesis.hash, [tx1, tx2]);
        const valid = block.isValid(genesis.hash, genesis.index, difficulty);
        expect(valid.success).toBeFalsy();
    });

    test("Should be valid", () => {
        const block = new Block(1, genesis.hash, [new Transaction({
            data: "Block 2",
        } as Transaction)]);
        block.minePoW(difficulty, miner);
        const valid = block.isValid(genesis.hash, genesis.index, difficulty);

        expect(valid.success).toBeTruthy();
    });

    test("Should create from block info", () => {
        const block = Block.fromBlockInfo({
            transactions: [new Transaction({
                data: "Block 2",
            } as Transaction)],
            difficulty: difficulty,
            feePerTx: 1,
            index: 1,
            maxDifficulty: 60,
            previousHash: genesis.hash,
        } as BlockInfo, "ejrgeek");

        block.minePoW(difficulty, miner);

        const valid = block.isValid(genesis.hash, genesis.index, difficulty);

        expect(valid.success).toBeTruthy();
    });

});