const fs = require('fs').promises;
const path = require('path');
const marked = require('marked');
const prettier = require('prettier');

async function readMarkdownFiles(inputDir, outputDir) {
    let template;
    try {
        template = await readTemplateFile();
    }
    catch (error) {
        console.error('Error reading template file:', error);

        return;
    }

    try {
        // Read all files in the input folder
        const files = await fs.readdir(inputDir);

        // Filter for markdown files (.md or .markdown)
        const markdownFiles = files.filter(file =>
            file.endsWith('.md') || file.endsWith('.markdown')
        );

        console.log(`Found ${markdownFiles.length} markdown files in ${inputDir}\n`);

        // Create output directory if it doesn't exist
        await fs.mkdir(outputDir, { recursive: true });

        for (const file of markdownFiles) {
            const fileInfo = path.parse(file);
            const filePath = path.join(inputDir, file);
            const content = await fs.readFile(filePath, 'utf-8');

            console.log(`Processing: ${file}`);

            const fileParts = content.split('\n---\n');

            const slides = [];

            for (const part of fileParts) {
                if (part.trim().length === 0) {
                    console.log('Skipping empty part');

                    continue;
                }

                const htmlContent = marked.parse(part);
                slides.push(`<div class="rsl-slide">${htmlContent}</div>`);
            }

            const resultContent = await prettier.format(
                template.replace('{{slides}}', slides.join('\n')),
                { parser: "html" }
            );

            const outputPath = path.join(outputDir, fileInfo.name + '.html');

            await fs.writeFile(outputPath, resultContent, 'utf-8');
        }

        console.log(`\nTotal markdown files processed: ${markdownFiles.length}`);
        console.log(`Output written to: ${outputDir}`);

    } catch (error) {
        console.error('Error reading markdown files:', error);
    }
}

async function readTemplateFile() {
    const templatePath = path.join(__dirname, 'template.txt');
    return fs.readFile(templatePath, 'utf-8');
}

// Parse CLI arguments
const args = process.argv.slice(2);

if (args.length < 2) {
    console.log('Usage: node script.js <input-directory> <output-directory>');
    console.log('Example: node script.js ./markdown-files ./output');
    process.exit(1);
}

const inputDir = args[0];
const outputDir = args[1];

// Run the function
readMarkdownFiles(inputDir, outputDir);