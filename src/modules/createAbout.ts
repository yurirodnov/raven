import fs from 'fs-extra';
import path from 'path';
import { marked } from 'marked';
import ejs from 'ejs';


export const createAbout = () => {
  const aboutContentPath = path.resolve('src', 'content', 'about.md');

  const aboutTemplatePath = path.resolve('src', 'template', 'about.html');

  const aboutOutputDir = path.resolve('src', 'output');

  const contentOfabout = fs.readFileSync(aboutContentPath, 'utf8');

  const htmlContent = marked(contentOfabout);

  const template = fs.readFileSync(aboutTemplatePath, 'utf8');

  const outputHtml = ejs.render(template, { content: htmlContent });

  const outputFileName = path.basename(aboutContentPath, '.md') + '.html';

  const outputPath = path.join(aboutOutputDir, outputFileName);

  fs.ensureDirSync(aboutOutputDir);

  fs.writeFileSync(outputPath, outputHtml);

  console.log(`Generated: ${outputPath}`);

}