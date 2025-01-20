import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import yargs from "yargs";

const app = express();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// const staticDir = path.resolve(__dirname, "template"); // например, папка 'public' с файлами

const argv = yargs(process.argv.slice(2)).options({
  directory: { type: "string", default: "template", description: "Directory to serve" },
}).argv;

const staticDir = path.resolve(__dirname, argv.directory);
const publicDir = path.resolve(__dirname, "public");
const outputDir = path.resolve(__dirname, "output");

app.use(express.static(staticDir));
app.use(express.static(publicDir));
app.use(express.static(outputDir));

app.get("/", (req, res) => {
  res.send("<h1>Welcome to the static site!</h1>");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
