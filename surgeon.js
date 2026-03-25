import fs from 'fs';
import * as cheerio from 'cheerio';


const folders = ['./raw-data', './output'];
folders.forEach(function(folder) {
    if (!fs.existsSync(folder)) fs.mkdirSync(folder);
});

function performSurgery(fileName) {
    console.log(`\n🩺 Opening file to perform surgery on: ${fileName}`);

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
            
            let x = "";
            let y = "";

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

    console.log(`\n✅ Surgery Complete! Here is your clean data:`);
    console.log("--------------------------------------------");
    console.log(result);
    console.log("--------------------------------------------");
}

try {
    performSurgery('0f9a8.svg'); 
} catch (err) {
    console.error(`❌ ERROR: ${err.message}`);
}