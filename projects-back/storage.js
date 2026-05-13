const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'projects.json');

const readProjects = () => {
    try {
        if (!fs.existsSync(FILE_PATH)) {
            return [];
        }
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading projects:', err);
        return [];
    }
};

const writeProjects = (projects) => {
    try {
        fs.writeFileSync(FILE_PATH, JSON.stringify(projects, null, 2));
    } catch (err) {
        console.error('Error writing projects:', err);
    }
};

module.exports = { readProjects, writeProjects };
