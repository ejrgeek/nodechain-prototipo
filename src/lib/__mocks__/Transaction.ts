import sha256 from "crypto-js/sha256";
import TransactionTypeEnum from "../enum/TransactionTypeEnum";
import Validation from "../Validation";
import TransactionInput from "../TransactionInput";

/**
 * Mocked Transaction class
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
        this.to = tx?.to || "carlinhos";
        this.txInput = tx?.txInput ? new TransactionInput(tx.txInput) : new TransactionInput();
        this.hash = tx?.hash || this.getHash();
    }

    getHash(): string {
        return "h-tx1";
    }

    isValid() : Validation {
        if (!this.to){
            return new Validation(false, "Invalid mocked transaction.");
        }

        if (!this.txInput?.isValid().success){
            return new Validation(false, "Invalid mocked txInput transaction",)
        }

        return new Validation();
    }


}