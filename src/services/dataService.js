const path = require('path');
const fs = require('fs').promises;

const DATA_DIR = path.join(__dirname, '..', '..', 'data');

async function loadData(filename) {
    const dataPath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data);
}

async function saveData(filename, data) {
    const dataPath = path.join(DATA_DIR, filename);
    await fs.writeFile(dataPath, JSON.stringify(data, null, 4), 'utf8');
}

module.exports = {
    loadData,
    saveData
};
