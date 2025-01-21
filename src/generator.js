import ejs from "ejs";
import { marked } from "marked";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mdPostsDir = path.resolve(__dirname, "content", "posts");
const postTemplate = path.resolve(__dirname, "template", "posts", "post.ejs");
const postsListTemplate = path.resolve(__dirname, "template", "posts_list.ejs");
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

const getHeadingFromMd = (str) => {
  let newHeading = str.split("\n")[0].replace(/<\/?[^>]+(>|$)/g, "");
  return newHeading;
};

const generatePosts = async () => {
  try {
    // read all .md files from directory "content/posts"
    const mdPosts = await fs.readdir(mdPostsDir);
    // create array for rendering links
    const links = [];
    // counter for processed files
    let processedFilesCounter = 0;

    for (let mdPost of mdPosts) {
      if (mdPost.endsWith(".md")) {
        // find a .md-file with content
        const pathToMdPostFile = path.resolve(mdPostsDir, mdPost);
        // get .md-content from file
        const mdContent = await fs.readFile(pathToMdPostFile, "utf8");
        // convert .md to .html
        const postContent = marked(mdContent);

        // create data template for using with EJS
        const data = {
          title: mdPost,
          content: postContent,
        };
        // reading html-template for post page
        const htmlForNewPost = await fs.readFile(postTemplate, "utf8");
        // rendered html with data from md
        const formattedHtml = ejs.render(htmlForNewPost, data);
        // create full name in fs for html file
        const newHtmlPost = path.resolve(outputDir, formatFileName(mdPost));

        // create html-file with post content
        await fs.writeFile(newHtmlPost, formattedHtml, "utf8");
        // add post's link to array
        links.push({ title: getHeadingFromMd(postContent), link: "./posts/" + path.basename(newHtmlPost) });

        processedFilesCounter += 1;
        // console.log(postContent.split("\n"));
        // console.log(links);
        console.log(`${processedFilesCounter} / ${mdPosts.length} files processed `);
      }
    }

    // render page with list of all posts
    const postsListHtml = await ejs.renderFile(postsListTemplate, { links });

    const postsListFile = path.resolve(__dirname, "output", "posts_list.html");
    // put page with all posts into "output" directory
    await fs.writeFile(postsListFile, postsListHtml, "utf8");
  } catch (error) {
    console.error("Generating error", error);
  }
};

generatePosts();
