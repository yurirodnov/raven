import fs from 'fs-extra';
import path from 'path';
import { marked } from 'marked';
import ejs from 'ejs';


export const createIndex = () => {
  const indexContentPath = path.resolve('src', 'content', 'index.md');

  const indexTemplatePath = path.resolve('src', 'template', 'index.html');

  const indexOutputDir = path.resolve('src', 'output');

  const contentOfIndex = fs.readFileSync(indexContentPath, 'utf8');

  const htmlContent = marked(contentOfIndex);

  const template = fs.readFileSync(indexTemplatePath, 'utf8');

  const outputHtml = ejs.render(template, { content: htmlContent });

  const outputFileName = path.basename(indexContentPath, '.md') + '.html';

  const outputPath = path.join(indexOutputDir, outputFileName);

  fs.ensureDirSync(indexOutputDir);

  fs.writeFileSync(outputPath, outputHtml);

  console.log(`Generated: ${outputPath}`);


}