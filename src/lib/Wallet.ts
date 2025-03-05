import * as secp from "tiny-secp256k1";
import ECPairFactory, {ECPairInterface} from "ecpair";


const ECPair = ECPairFactory(secp);

/**
 * Wallet class
 */
export default class Wallet {

    primaryKey: string;
    publicKey: string;

    constructor(wifOrPrivateKey?: string) {

        let keys;

        if(wifOrPrivateKey){
            if(wifOrPrivateKey.length === 64){
                keys = ECPair.fromPrivateKey(Buffer.from(wifOrPrivateKey, "hex"));
            } else {
                keys = ECPair.fromWIF(wifOrPrivateKey);
            }
        } else {
            keys = ECPair.makeRandom();
            if (!keys.privateKey) {
                throw new Error("Failed to generate private key");
            }
        }

        this.primaryKey = Buffer.from(keys.privateKey).toString("hex");
        this.publicKey = Buffer.from(keys.publicKey).toString("hex");

    }


}