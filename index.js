const { program } = require('commander');
const fs = require('fs');
const https = require('https');

program
  .requiredOption('-i, --input <file>', 'input JSON file')
  .option('-o, --output <file>', 'output result file')
  .option('-d, --display', 'display the result in console');

program.parse(process.argv);
const options = program.opts();

if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}

function fetchDataFromAPI() {
  const url = 'https://bank.gov.ua/NBU_ovdp?json&date=14.12.2021&val_code=UAH&mode=AuctionDate&ord=asc';

  https.get(url, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      fs.writeFileSync('data.json', data);
      console.log('Data saved to data.json');
      processData(data);
    });

  }).on('error', (err) => {
    console.log('Error: ' + err.message);
  });
}

function processData(data) {
  let jsonData;
  try {
    jsonData = JSON.parse(data);
  } catch (err) {
    console.error('Error parsing JSON data');
    process.exit(1);
  }

  const result = jsonData.map(item => {
    return `${item.StockCode}-${item.ValCode}-${item.Attraction}`;
  }).join('\n');

  if (options.display) {
    console.log(result);
  }

  if (options.output) {
    try {
      fs.writeFileSync(options.output, result);
      console.log(`Result saved to ${options.output}`);
    } catch (err) {
      console.error('Error writing to file:', err);
    }
  }
}

let data;
try {
  data = fs.readFileSync(options.input, 'utf8');
  processData(data);
} catch (err) {
  console.error('Cannot find input file, fetching data from API...');
  fetchDataFromAPI();
}
