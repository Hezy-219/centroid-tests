import { handleInput, findCentroid } from "./system.js";
import { embed } from "./embed.js";
import fs from "fs";

const CONFIG = JSON.parse(fs.readFileSync("./config.json"));

const input = "drone battery optimization";
const result = handleInput(input, CONFIG);
console.log("Result:", result);

const inputVec = embed(input, CONFIG);
const found = findCentroid(inputVec, CONFIG);
console.log("Found centroid:", found);