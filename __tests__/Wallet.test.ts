import TransactionInput from "../src/lib/TransactionInput";
import Wallet from "../src/lib/Wallet";

describe("Wallet Tests", () => {

    const wif = "5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ";
    let ashWallet: Wallet;

    beforeAll(() => {
        ashWallet = new Wallet();
    });

    test("Should generate valid wallet", () => {
        
        const wallet = new Wallet();
        expect(wallet.primaryKey).toBeTruthy();
        expect(wallet.primaryKey).toHaveLength(64);
        expect(wallet.publicKey).toBeTruthy();

    });

    test("Should recover wallet (primaryKey)", () => {
        
        const wallet = new Wallet(ashWallet.primaryKey);
    
        expect(wallet.publicKey).toEqual(ashWallet.publicKey);

    });

    test("Should recover wallet (wif)", () => {
        
        const wallet = new Wallet(wif);
    
        expect(wallet.primaryKey).toBeTruthy();
        expect(wallet.publicKey).toBeTruthy();

    });

});