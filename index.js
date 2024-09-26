const fs = require('fs');
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

fs.readFile(options.input, (err, data) => {
  if (err) {
    console.error('Cannot find input file:', err.message);
    process.exit(1);
  }

  try {
    const json = JSON.parse(data);

    if (!Array.isArray(json)) {
      console.error('Некоректний формат даних. Очікувався масив.');
      return;
    }

    const result = json.map(item => {
      return `${item.StockCode}-${item.ValCode}-${item.Attraction}`;
    }).join('\n');

    if (options.display) {
      console.log(result);
    }

    if (options.output) {
      fs.writeFile(options.output, result, (writeErr) => {
        if (writeErr) {
          console.error('Помилка запису файлу:', writeErr.message);
        } else {
          console.log(`Результат записано у файл: ${options.output}`);
        }
      });
    }

  } catch (parseErr) {
    console.error('Помилка парсингу JSON:', parseErr.message);
  }
});