const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'projects.json');
const SETTINGS_PATH = path.join(__dirname, 'settings.json');

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

const readSettings = () => {
    try {
        if (!fs.existsSync(SETTINGS_PATH)) {
            return { activeLanguages: ['az', 'en'] };
        }
        const data = fs.readFileSync(SETTINGS_PATH, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading settings:', err);
        return { activeLanguages: ['az', 'en'] };
    }
};

const writeSettings = (settings) => {
    try {
        fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));
    } catch (err) {
        console.error('Error writing settings:', err);
    }
};

module.exports = { readProjects, writeProjects, readSettings, writeSettings };

