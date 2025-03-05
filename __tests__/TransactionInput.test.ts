import TransactionInput from "../src/lib/TransactionInput";
import Wallet from "../src/lib/Wallet";

describe("Transaction Input Tests", () => {

    let carlinhosWallet: Wallet;
    let atacanteWallet: Wallet;

    beforeAll(() => {
        carlinhosWallet = new Wallet();
        atacanteWallet = new Wallet();
    });

    test("Should be valid", () => {
        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: carlinhosWallet.publicKey,
        } as TransactionInput);

        txInput.sign(carlinhosWallet.privateKey);

        const valid = txInput.isValid();
        expect(valid.success).toBeTruthy();

    });

    test("Should NOT be valid (sign)", () => {
        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: carlinhosWallet.publicKey,
        } as TransactionInput);

        const valid = txInput.isValid();
        expect(valid.success).toBeFalsy();

    });

    test("Should NOT be valid (amount)", () => {
        const txInput = new TransactionInput({
            amount: 0,
            fromAddress: carlinhosWallet.publicKey,
        } as TransactionInput);

        txInput.sign(carlinhosWallet.privateKey);

        const valid = txInput.isValid();
        expect(valid.success).toBeFalsy();

    });

    test("Should NOT be valid (constructor)", () => {
        const txInput = new TransactionInput();

        txInput.sign(carlinhosWallet.privateKey);

        const valid = txInput.isValid();
        expect(valid.success).toBeFalsy();

    });

    test("Should NOT be valid (invalid signature)", () => {
        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: carlinhosWallet.publicKey,
        } as TransactionInput);
    
        txInput.sign(atacanteWallet.privateKey);
    
        const valid = txInput.isValid();
        expect(valid.success).toBeFalsy();
    });

});