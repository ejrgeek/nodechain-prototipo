import Validation from "../Validation";

/**
 * Mocked Transaction Input class
 */
export default class TransactionInput {

    fromAddress: string;
    amount: number;
    signature: string;

    /**
     * Creates a new Mocked TransactionInput
     * @param txInput tx input data
     */
    constructor(txInput?: TransactionInput){
        this.fromAddress = txInput?.fromAddress || "carlinhos";
        this.amount = txInput?.amount || 10;
        this.signature = txInput?.signature || "txiabc";
    }

    /**
     * Generate tx input signature
     * @param privateKey from private key
     */
    sign(privateKey: string) : void {
        this.signature = "txiabc";
    }

    /**
     * Generates tx input hash
     * @returns tx input hash
     */
    getHash() : string {    
        return "hashtxi";
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

        return new Validation();
    }

}
