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
    txInput: TransactionInput | undefined;
    to: string;

    constructor(tx?: Transaction){
        this.type = tx?.type || TransactionTypeEnum.REGULAR;
        this.timestamp = tx?.timestamp || Date.now();
        this.to = tx?.to || "";
        this.txInput = tx?.txInput ? new TransactionInput(tx.txInput) : new TransactionInput();
        this.hash = tx?.hash || this.getHash();
    }

    getHash(): string {
        const from = this.txInput ? this.txInput.getHash() : "";
        return sha256(this.type + this.to + from + this.timestamp).toString();
    }

    isValid() : Validation {
        if (this.hash !== this.getHash()) {
            return new Validation(false, "Invalid hash.");
        }

        if (!this.to){
            return new Validation(false, "Invalid To.");
        }

        if(this.txInput){
            const validation = this.txInput.isValid();
            if (!validation.success) {
                return new Validation(false, `Invalid tx: ${validation.message}`);
            }
        }

        return new Validation();
    }


}