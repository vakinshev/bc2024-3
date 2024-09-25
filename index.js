const fs = require('fs');

fs.readFile('data.json', (err, data) => {
  if (err) {
    console.error('Помилка зчитування файлу data.json:', err);
    return;
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

    console.log(result);

  } catch (parseErr) {
    console.error('Помилка парсингу JSON:', parseErr);
  }
});
