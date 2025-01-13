import ejs from "ejs";
import { marked } from "marked";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mdPostsDir = path.resolve(__dirname, "content", "posts");
const postTemplate = path.resolve(__dirname, "template", "posts", "post.html");
const postsListFile = path.resolve(__dirname, "output", "posts_list.html");
const outputDir = path.resolve(__dirname, "output", "posts");

const formatFileName = (str) => {
  let newName = "";
  for (const char of str) {
    if (char !== ".") {
      newName += char;
    } else {
      break;
    }
  }

  return newName + ".html";
};

const generatePosts = async () => {
  try {
    const mdPosts = await fs.readdir(mdPostsDir);

    let processedFilesCounter = 0;

    for (let mdPost of mdPosts) {
      if (mdPost.endsWith(".md")) {
        const pathToMdPostFile = path.resolve(mdPostsDir, mdPost);
        const mdContent = await fs.readFile(pathToMdPostFile, "utf8");
        const htmlContent = marked(mdContent);
        const htmlForNewPost = await fs.readFile(postTemplate, "utf8");

        const newHtmlPost = path.resolve(outputDir, formatFileName(mdPost));
        await fs.writeFile(newHtmlPost, htmlForNewPost, "utf8");

        processedFilesCounter += 1;
        console.log(newHtmlPost);
        console.log(`${processedFilesCounter} / ${mdPosts.length} files processed `);
      }
    }
  } catch (error) {
    console.error("Generating error", error);
  }
};

generatePosts();
