import * as secp from "tiny-secp256k1";
import ECPairFactory from "ecpair";
import sha256 from "crypto-js/sha256";
import Validation from "./Validation";

const ECPair = ECPairFactory(secp);

/**
 * Transaction Input class
 */
export default class TransactionInput {

    fromAddress: string;
    amount: number;
    signature: string;

    /**
     * Creates a new TransactionInput
     * @param txInput tx input data
     */
    constructor(txInput?: TransactionInput){
        this.fromAddress = txInput?.fromAddress || "";
        this.amount = txInput?.amount || 0;
        this.signature = txInput?.signature || "";
    }

    /**
     * Generate tx input signature
     * @param privateKey from private key
     */
    sign(privateKey: string) : void {
        this.signature = ECPair.fromPrivateKey(Buffer.from(privateKey, "hex"))
        .sign(Buffer.from(this.getHash(), "hex"))
        .toString("hex");
    }

    /**
     * Generates tx input hash
     * @returns tx input hash
     */
    getHash() : string {
        return sha256(this.fromAddress+this.amount).toString();
    }

    /**
     * Validates tx input
     * @returns a validation result object
     */
    isValid() : Validation {
        if(!this.signature){
            return new Validation(false, "Signature is required.");
        }
        if (this.amount < 1){
            return new Validation(false, "Amount must be greater than zero.");
        }

        const hash = Buffer.from(this.getHash(), "hex");
        const isValid = ECPair.fromPublicKey(Buffer.from(this.fromAddress, "hex"))
            .verify(hash, Buffer.from(this.signature, "hex"));

        return isValid ? new Validation() : new Validation(false, "Invalid Tx Input Signature.");
    }

}
