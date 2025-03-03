import axios from "axios";
import BlockInfo from "../lib/interfaces/BlockInfo";
import Block from "../lib/model/Block";

const BLOCKCHAIN_SERVER = "http://localhost:3000";

const MINER_WALLET = {
    privateKey: "pipipipopopo",
    publicKey: "ejrgeek",
}

let totalMined = 0;

async function minePoW() {
    console.log("[?] Retrieving information from the next block ...");
    
    const { data } = await axios.get(`${BLOCKCHAIN_SERVER}/blocks/next`);
    const blockInfo = data as BlockInfo;

    const newBlock = Block.fromBlockInfo(blockInfo, MINER_WALLET.publicKey);

    //! TODO: add tx reward

    console.log(`[!] START mining block #${newBlock.index}`);
    newBlock.minePoW(blockInfo.difficulty, MINER_WALLET.publicKey);

    try {
        await axios.post(`${BLOCKCHAIN_SERVER}/blocks`, newBlock);
        console.log("[+] Block sent and accepted!");
        totalMined++;
        console.log(`[+] Total mined blocks: ${totalMined}`);
    } catch (err: any) {
        console.error(err.response ? err.response.data : err.message);
    }

    setTimeout(() => {
        minePoW();
    }, 1000);
}

minePoW();