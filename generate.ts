import fs from 'fs-extra';
import path from 'path';
import { marked } from 'marked';
import ejs from 'ejs';

// Путь к контенту и шаблонам
const contentDir = path.join(__dirname, 'content');
const outputDir = path.join(__dirname, 'output');
const templatePath = path.join(__dirname, 'templates', 'index.html');

// Убедитесь, что папка output существует
fs.ensureDirSync(outputDir);

// Получаем список всех Markdown файлов в папке content
const posts = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'));

// Функция для генерации статической страницы для каждого поста
posts.forEach((postFile) => {
  const postPath = path.join(contentDir, postFile);
  const postContent = fs.readFileSync(postPath, 'utf8');

  // Конвертируем Markdown в HTML
  const htmlContent = marked(postContent);

  // Читаем шаблон
  const template = fs.readFileSync(templatePath, 'utf8');

  // Генерируем итоговую HTML-страницу с помощью EJS
  const outputHtml = ejs.render(template, { content: htmlContent });

  // Сохраняем HTML в папку output
  const outputPath = path.join(outputDir, postFile.replace('.md', '.html'));
  fs.writeFileSync(outputPath, outputHtml);

  console.log(`Generated: ${outputPath}`);
});