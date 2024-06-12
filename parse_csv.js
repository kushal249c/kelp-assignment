const fs = require('fs');

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const rows = data.split('\n');
        const jsonData = [];
        const headers = rows[0].split(',');

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i].split(',');
          const object = {};

          for (let j = 0; j < headers.length; j++) {
            const header = headers[j].trim();
            const value = row[j].trim();

            // Handle nested properties with dot notation
            if (header.includes('.')) {
              const nestedKeys = header.split('.');
              let currentObject = object;
              for (let k = 0; k < nestedKeys.length - 1; k++) {
                const key = nestedKeys[k];
                currentObject[key] = currentObject[key] || {};
                currentObject = currentObject[key];
              }
              currentObject[nestedKeys[nestedKeys.length - 1]] = value;
            } else {
              object[header] = value;
            }
          }

          jsonData.push(object);
        }

        resolve(jsonData);
      }
    });
  });
}

module.exports = parseCSV;