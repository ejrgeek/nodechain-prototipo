import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import Wallet from "../lib/Wallet";
import readline from "readline";
import { exit } from "process";
import Transaction from "../lib/Transaction";
import TransactionTypeEnum from "../lib/enum/TransactionTypeEnum";
import TransactionInput from "../lib/TransactionInput";

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER;

let myWalletPbK = "";
let myWalletPvK = "";

const rdl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function menu() {
    setTimeout(() => {
        console.clear();

        if (myWalletPbK) {
            console.log(`Logged @: ${myWalletPbK}.`);
        } else {
            console.log("Aren't logged.");
        }

        console.log(". . .");
        console.log("1 - Create New Wallet");
        console.log("2 - Recover Wallet");
        console.log("3 - Balance");
        console.log("4 - Send Tx");
        console.log("5 - Logout");
        console.log("6 - Exit");

        rdl.question("[>] Choose Your Option: ", (answer) => {

            switch (answer) {
                case "1":
                    createWallet();
                    break;
                case "2":
                    recoverWallet();
                    break;
                case "3":
                    getBalance();
                    break;
                case "4":
                    sendTx();
                    break;
                case "5":
                    logout();
                    break;
                case "6":
                    console.log("[!] Stopping NodeWallet!");
                    exit(0);
                default:
                    console.log("[!] Invalid option!");
                    menu();

            }

        });

    }, 1000);
}

function prevMenu() {
    rdl.question("\n[>] Press any key to continue ...", () => {
        menu();
    });
}

function logout() {
    console.log("\n[!]You are being logged out.");
    myWalletPbK = "";
    myWalletPvK = "";
    console.clear();
    console.log("[!] You have been logged out");
    prevMenu();
}

function createWallet() {
    console.clear();

    const wallet = new Wallet();

    myWalletPbK = wallet.publicKey;
    myWalletPvK = wallet.privateKey;

    console.log("[+] Your new wallet has been created:");
    console.log(wallet);
    console.log("\n[!] Save this information, do not share your private key.");

    prevMenu();

}

function recoverWallet() {
    console.clear();

    let pv

    rdl.question("[>] Inform your private key or WIF? ", (wifOrPvk) => {

        if (!wifOrPvk) {
            createWallet();
        }

        const wallet = new Wallet(wifOrPvk);
        myWalletPbK = wallet.publicKey;
        myWalletPvK = wallet.privateKey;
        console.log("\n[+] Your Wallet:");
        console.log(wallet);
        console.log("\n[!] Remember, do not share your private key.");
        prevMenu();
    });

}

function getBalance() {
    console.clear();
    if (!myWalletPbK) {
        console.log("[!] You don't have a wallet yet.");
        return prevMenu();
    }

    //! TODO: GET BALANCE BY API
    console.log("[!] SORRY, COMING SOON!");

    prevMenu();
}

function sendTx() {
    console.clear();

    if (!myWalletPbK) {
        console.log("[!] You don't have a wallet yet.");
        return prevMenu();
    }

    //! TODO: SEND TX BY API
    console.log(`[+] Your wallet @ ${myWalletPbK}`);

    rdl.question("[>] Send To Wallet: ", (toWallet) => {

        if (toWallet.length < 66 && toWallet !== myWalletPbK) {
            console.log(`[!] Invalid wallet: ${toWallet}`);
            return prevMenu();
        }

        rdl.question("Amount: ", async (amountStr) => {
            
            const amount = parseInt(amountStr);

            if (!amount) {
                console.log(`[!] Invalid amount: ${amount}`);
                return prevMenu();
            }

            //!TODO:: BALANCE VALIDATION

            const tx = new Transaction();
            tx.timestamp = Date.now();
            tx.to = toWallet;
            tx.type = TransactionTypeEnum.REGULAR;
            tx.txInput = new TransactionInput({
                amount,
                fromAddress: myWalletPbK,
            } as TransactionInput);

            tx.txInput.sign(myWalletPvK);
            tx.hash = tx.getHash();

            console.log(tx.isValid());

            try {

                const txResponse = await axios.post(`${BLOCKCHAIN_SERVER}/transactions/`, tx);
                console.log("\nTransaction accepted. Waiting the miners");
                console.log(`\nTransaction Hash: ${txResponse.data.hash}`);

            } catch(err: any){
                console.error(`[!] ${err.response ? err.response.data : err.message}`);
            }

            return prevMenu();

        });

    });

    prevMenu();
}

menu();