import fs from 'fs-extra';
import path from 'path';
import { marked } from 'marked';
import ejs from 'ejs';


const contentDir = path.join(__dirname, 'content/posts');
const outputDir = path.join(__dirname, 'output');
const templatePath = path.join(__dirname, 'template', 'index.html');


fs.ensureDirSync(outputDir);


const posts = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'));


posts.forEach((postFile) => {
  const postPath = path.join(contentDir, postFile);
  const postContent = fs.readFileSync(postPath, 'utf8');


  const htmlContent = marked(postContent);


  const template = fs.readFileSync(templatePath, 'utf8');


  const outputHtml = ejs.render(template, { content: htmlContent });


  const outputPath = path.join(outputDir, postFile.replace('.md', '.html'));
  fs.writeFileSync(outputPath, outputHtml);

  console.log(`Generated: ${outputPath}`);
});