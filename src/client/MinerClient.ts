import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import BlockInfo from "../lib/interfaces/BlockInfo";
import Block from "../lib/Block";

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER || "https://localhost:3000";

const MINER_WALLET = {
    privateKey: "pipipipopopo",
    publicKey: process.env.MINER_WALLET || "ejrgeek",
}

let totalMined = 0;

console.log(`[*] Logged as ${MINER_WALLET.publicKey}`);

async function minePoW() {
    console.log("[?] Retrieving information from the next block ...");
    
    const { data } = await axios.get(`${BLOCKCHAIN_SERVER}/blocks/next`);

    if (!data) {
        console.log("[?] No tx found. Waiting ...");
        return setTimeout(() => {
            minePoW();
        }, 5000);
    }

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