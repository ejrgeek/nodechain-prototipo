import { app } from "./BlockchainServer";

const PORT = process.env.PORT || 3000;

if (process.argv.includes("--run")) {
    app.listen(PORT, () => {
        console.log(`Blockchain server is running at ${PORT}`);
    });
}