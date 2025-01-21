import ejs from "ejs";
import { marked } from "marked";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { title } from "process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mdPostsDir = path.resolve(__dirname, "content", "posts");
const postTemplate = path.resolve(__dirname, "template", "posts", "post.ejs");
const postsListFile = path.resolve(__dirname, "output", "posts_list.html");
const postsListTemplate = path.resolve(__dirname, "template", "posts_list.ejs");
const outputDir = path.resolve(__dirname, "output", "posts");
const titleRegex = /<([^>]+)>(.*?)<\/\\1>/;

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

const getHeadingFromMd = (str) => {
  let newHeading = str.split("\n")[0].replace(/<\/?[^>]+(>|$)/g, "");
  return newHeading;
};

const generatePosts = async () => {
  try {
    const mdPosts = await fs.readdir(mdPostsDir);
    const links = [];
    let processedFilesCounter = 0;

    for (let mdPost of mdPosts) {
      if (mdPost.endsWith(".md")) {
        const pathToMdPostFile = path.resolve(mdPostsDir, mdPost);
        const mdContent = await fs.readFile(pathToMdPostFile, "utf8");
        const postContent = marked(mdContent);

        const data = {
          title: mdPost,
          content: postContent,
        };
        const htmlForNewPost = await fs.readFile(postTemplate, "utf8");
        const formattedHtml = ejs.render(htmlForNewPost, data);
        const newHtmlPost = path.resolve(outputDir, formatFileName(mdPost));

        await fs.writeFile(newHtmlPost, formattedHtml, "utf8");
        links.push({ title: getHeadingFromMd(postContent), link: "./posts/" + path.basename(newHtmlPost) });

        processedFilesCounter += 1;
        console.log(postContent.split("\n"));
        // console.log(links);
        console.log(`${processedFilesCounter} / ${mdPosts.length} files processed `);
      }
    }

    const postsListHtml = await ejs.renderFile(postsListTemplate, { links });

    const postsListFile = path.resolve(__dirname, "output", "posts_list.html");
    await fs.writeFile(postsListFile, postsListHtml, "utf8");
  } catch (error) {
    console.error("Generating error", error);
  }
};

generatePosts();
