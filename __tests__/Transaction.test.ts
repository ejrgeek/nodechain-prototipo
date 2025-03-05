import Transaction from "../src/lib/Transaction";
import TransactionTypeEnum from "../src/lib/enum/TransactionTypeEnum";
import TransactionInput from "../src/lib/TransactionInput";

jest.mock("../src/lib/TransactionInput");

describe("Transaction Tests", () => {

    test("Should be invalid (No data)", () => {

        const tx = new Transaction();

        const valid = tx.isValid();

        expect(valid.success).toBeFalsy();
    });

    test("Should be invalid (invalid hash)", () => {

        const tx = new Transaction({
            txInput: new TransactionInput(),
        } as Transaction);

        tx.hash = "";

        const valid = tx.isValid();

        expect(valid.success).toBeFalsy();
    });

    test("Should be valid (REGULAR)", () => {

        const tx = new Transaction({
            txInput: new TransactionInput(),
            type: TransactionTypeEnum.REGULAR,
            timestamp: Date.now(),
            to: "carlinhos",
        } as Transaction)

        const valid = tx.isValid();

        expect(valid.success).toBeTruthy();
    });

    test("Should be valid (FEE)", () => {

        const tx = new Transaction({
            txInput: new TransactionInput(),
            type: TransactionTypeEnum.FEE,
            to: "carlinhos",
        } as Transaction)

        const valid = tx.isValid();

        expect(valid.success).toBeTruthy();
    });

    test("Should be invalid transaction input", () => {

        const tx = new Transaction({
            txInput: new TransactionInput({
                amount: -1
            } as TransactionInput),
            type: TransactionTypeEnum.FEE,
            to: "carlinhos",
        } as Transaction)

        const valid = tx.isValid();

        expect(valid.success).toBeFalsy();
    });

    test("Should generate hash without txInput", () => {

        const tx = new Transaction({
            type: TransactionTypeEnum.FEE,
            to: "carlinhos",
        } as Transaction)

        tx.txInput = undefined;

        const hash = tx.getHash();

        expect(hash).toBeTruthy();
    });

    

});