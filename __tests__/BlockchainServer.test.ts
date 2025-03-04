import request from "supertest";
import {app} from "../src/server/BlockchainServer";
import Block from "../src/lib/Block";

jest.mock("../src/lib/Block");
jest.mock("../src/lib/Blockchain");

describe("Blockchain Server Test", () => {

    test("GET / - Should return blockchain", async () => {
        const response = await request(app).get("/");

        expect(response.status).toBe(200);
        expect(response.body.isValid.success).toBeTruthy();

    });

    test("GET /status - Should return status", async () => {
        const response = await request(app).get("/status/");

        expect(response.status).toBe(200);
        expect(response.body.isValid.success).toBeTruthy();

    });

    test("GET /blocks/:indexOrHash - Should get genesis block by index", async () => {
        const response = await request(app).get("/blocks/0");

        expect(response.status).toBe(200);
        expect(response.body.index).toBe(0);

    });

    test("GET /blocks/:indexOrHash - Should get genesis block by hash", async () => {
        const response = await request(app).get("/blocks/abc");

        expect(response.status).toBe(200);
        expect(response.body.hash).toBe("abc");

    });

    test("GET /blocks/:indexOrHash - Should NOT get genesis block", async () => {
        const response = await request(app).get("/blocks/-1");

        expect(response.status).toBe(404);

    });

    test("POST /blocks/ - Should add block", async () => {
        
        const block = new Block(1, "abc", "New block", "ejrgeek", 0);
        
        const response = await request(app)
            .post("/blocks/")
            .send(block);

        expect(response.status).toBe(201);
        expect(response.body.lastBlock.index).toBe(1);

    });

    test("POST /blocks/ - Should NOT add block no content", async () => {
                
        const response = await request(app)
            .post("/blocks/")
            .send({});

        expect(response.status).toBe(422);

    });

    test("POST /blocks/ - Should NOT add invalid block", async () => {
        
        const block = new Block(0, "", "");
        
        const response = await request(app)
            .post("/blocks/")
            .send(block);

        expect(response.status).toBe(422);

    });

    test("POST /blocks/next - Should GET next block info", async () => {
                
        const response = await request(app).get("/blocks/next");

        expect(response.status).toBe(200);
        expect(response.body.index).toBe(1);

    });


});