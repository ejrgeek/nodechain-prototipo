import BlockInfo from "../src/lib/interfaces/BlockInfo";
import Block from "../src/lib/Block";
import Transaction from "../src/lib/Transaction";
import TransactionTypeEnum from "../src/lib/enum/TransactionTypeEnum";

describe("Transaction Tests", () => {

    test("Should be valid (No data)", () => {

        const tx = new Transaction();

        const valid = tx.isValid();

        expect(valid.success).toBeFalsy();
    });

    test("Should be valid (invalid hash)", () => {

        const tx = new Transaction({
            data: new Date().toString(),
        } as Transaction);

        tx.hash = "";

        const valid = tx.isValid();

        expect(valid.success).toBeFalsy();
    });

    test("Should be valid (REGULAR)", () => {

        const tx = new Transaction({
            data: "TX 2",
            type: TransactionTypeEnum.REGULAR,
            timestamp: Date.now(),
        } as Transaction)

        const valid = tx.isValid();

        expect(valid.success).toBeTruthy();
    });

    test("Should be valid (FEE)", () => {

        const tx = new Transaction({
            data: "TX 2",
            type: TransactionTypeEnum.FEE,
        } as Transaction)

        const valid = tx.isValid();

        expect(valid.success).toBeTruthy();
    });

    

});