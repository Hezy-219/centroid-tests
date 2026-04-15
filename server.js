import express from "express";
import fs from "fs";
import { embed } from "./embed.js";
import { handleInput } from "./system.js";

const app = express();
app.use(express.json());

const CONFIG = JSON.parse(fs.readFileSync("./config.json"));

app.post("/process", async (req, res) => {
  const { input } = req.body;

  const result = handleInput(input, CONFIG);

  res.json(result);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});