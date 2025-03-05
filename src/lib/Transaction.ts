import sha256 from "crypto-js/sha256";
import TransactionTypeEnum from "./enum/TransactionTypeEnum";
import Validation from "./Validation";
import TransactionInput from "./TransactionInput";

/**
 * Transaction class
 */
export default class Transaction {

    type: TransactionTypeEnum;
    timestamp: number;
    hash: string;
    txInput: TransactionInput;
    to: string;

    constructor(tx?: Transaction){
        this.type = tx?.type || TransactionTypeEnum.REGULAR;
        this.timestamp = tx?.timestamp || Date.now();
        this.to = tx?.to || "";
        this.hash = tx?.hash || this.getHash();
        this.txInput = new TransactionInput(tx?.txInput);
    }

    getHash(): string {
        return sha256(this.type+this.to+this.txInput.getHash()+this.timestamp).toString();
    }

    isValid() : Validation {
        if (this.hash !== this.getHash()) {
            return new Validation(false, "Invalid hash.");
        }

        if (!this.to){
            return new Validation(false, "Invalid To.");
        }

        

        return new Validation();
    }


}