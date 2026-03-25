import fs from 'fs';
import * as cheerio from 'cheerio';


const folders = ['./raw-data', './output'];
folders.forEach(function(folder) {
    if (!fs.existsSync(folder)) fs.mkdirSync(folder);
});

function performSurgery(fileName) {

    const filepath = `./raw-data/${fileName}`;
    
    if (!fs.existsSync(filepath)) {
        throw new Error(`File not found at ${filepath}`);
    }

    const rawSvg = fs.readFileSync(filepath, 'utf8');
    const $ = cheerio.load(rawSvg, { xmlMode: true });

    let result = "";

    $('path').each((i, path) => {
        const data = $(path).attr('d');
        if (data) {
            const cleanData = data.replace(/\s+/g, ' ').trim();

            const textElement = $(`text:contains("${i + 1}")`);
            
            let x = '';
            let y = '';

            if (textElement.length > 0) {
                const transform = $(textElement).attr('transform');
                if (transform && transform.includes('matrix')) {
                    const matrixValues = transform.match(/[-+]?[0-9]*\.?[0-9]+/g);
                    if (matrixValues && matrixValues.length >= 6) {
                        x = matrixValues[4];
                        y = matrixValues[5];
                    }
                }
            }
            

            result += `<path d="${cleanData}" data-x="${x}" data-y="${y}"></path>`;
        }
    });

    return result;
}

function runBatchSurgery() {
    const rawDataPath = './raw-data';
    const files = fs.readdirSync(rawDataPath);
    const svgFiles = files.filter(function(file) { 
        return file.endsWith('.svg');
    });

    let masterTSV = '';

    console.log(`🚀 Starting Batch Surgery on ${svgFiles.length} files...`);

    svgFiles.forEach((file, index) => {

        const percent = Math.round(((index + 1) / svgFiles.length) * 100);
        process.stdout.write(`\r[${percent}%] 🩺 Operating on: ${file}           `);

        const surgeryResult = performSurgery(file);

        const hexName = file.replace('.svg', '');

        let kanjiName;
        try {
            kanjiName = String.fromCodePoint(parseInt(hexName, 16));
        } catch (err) {
            kanjiName = hexName;
        }

        masterTSV += `${kanjiName}\t${surgeryResult}\n`;

    });

    fs.writeFileSync('./output/n2-kanji-batch.tsv', masterTSV);
    console.log(`\n\n🎉 Done! Saved ${svgFiles.length} Kanji to ./output/n2-kanji-batch.tsv`);
}

runBatchSurgery();