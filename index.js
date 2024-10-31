const fs = require('fs');
const path = require('path');
const { program } = require('commander');

program
  .requiredOption('-i, --input <path>', 'шлях до файлу для читання (json з даними)')
  .option('-o, --output <path>', 'шлях до файлу, у якому записуємо результат')
  .option('-d, --display', 'вивести результат у консоль');

program.parse(process.argv);
const options = program.opts();

if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}

const inputPath = path.resolve(options.input);

try {
  const data = fs.readFileSync(inputPath, 'utf-8');
  const json = JSON.parse(data);

  if (!Array.isArray(json)) {
    console.error('Некоректний формат даних. Очікувався масив.');
    return;
  }

  const result = json.map(item => `${item.StockCode}-${item.ValCode}-${item.Attraction}`).join('\n');

  if (options.display) {
    console.log(result);
  }

  if (options.output) {
    const outputPath = path.resolve(options.output);
    fs.writeFileSync(outputPath, result);
    console.log(`Результат записано у файл: ${outputPath}`);
  }

  if (!options.output && !options.display) {
    console.log('No output specified. Use -d to display or -o to save the result.');
  }

} catch (err) {
  console.error(`Error: ${err.message}`);
}пше
