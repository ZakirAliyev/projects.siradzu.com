require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { randomUUID } = require('crypto');
const slugify = require('slugify');
const jwt = require('jsonwebtoken');
const upload = require('./upload');
const { readProjects, writeProjects, readSettings, writeSettings } = require('./storage');

const app = express();
const isProduction = process.env.USER === 'root' || process.env.HOME === '/root';
const PORT = isProduction ? 5005 : (process.env.PORT || 5001);
const JWT_SECRET = process.env.JWT_SECRET || 'texnocode_secret_key_2026';

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Forbidden' });
        req.user = user;
        next();
    });
};

// Login Route
app.post(['/api/login', '/login'], (req, res) => {
    const { email, password } = req.body;
    
    // Hardcoded credentials as requested
    if (email === 'admin@texnocode.com' && password === 'Admin123!') {
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
        return res.json({ token });
    }

    res.status(401).json({ error: 'Invalid credentials' });
});

// Get all projects (Public)
app.get(['/api/projects', '/projects'], (req, res) => {
    const projects = readProjects();
    const sorted = projects.sort((a, b) => (a.order || 0) - (b.order || 0));
    res.json(sorted);
});

// Get single project by slug (Public)
app.get(['/api/projects/:slug', '/projects/:slug'], (req, res) => {
    const { slug } = req.params;
    const projects = readProjects();
    const project = projects.find(p => p.slug === slug);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
});

// Protected Routes below
app.post(['/api/projects', '/projects'], authenticateToken, (req, res) => {
    upload(req, res, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        const { name_az, name_en, name_ru, desc_az, desc_en, desc_ru, website, showInMenu } = req.body;
        const files = req.files;
        if (!files || !files['cardImage']) return res.status(400).json({ error: 'Card image is required' });

        const projects = readProjects();
        let slug = slugify(name_en || name_az || name_ru || 'project', { lower: true, strict: true });
        let originalSlug = slug;
        let counter = 1;
        while (projects.some(p => p.slug === slug)) {
            slug = `${originalSlug}-${counter}`;
            counter++;
        }

        const newProject = {
            id: randomUUID(),
            slug,
            order: projects.length,
            name: { az: name_az || '', en: name_en || '', ru: name_ru || '' },
            description: { az: desc_az || '', en: desc_en || '', ru: desc_ru || '' },
            website: website || '',
            showInMenu: showInMenu !== undefined ? (showInMenu === 'true' || showInMenu === true) : true,
            cardImage: `/uploads/${files['cardImage'][0].filename}`,
            files: {
                word_az: files['word_az'] ? `/uploads/${files['word_az'][0].filename}` : null,
                word_en: files['word_en'] ? `/uploads/${files['word_en'][0].filename}` : null,
                word_ru: files['word_ru'] ? `/uploads/${files['word_ru'][0].filename}` : null,
                ppt_az: files['ppt_az'] ? `/uploads/${files['ppt_az'][0].filename}` : null,
                ppt_en: files['ppt_en'] ? `/uploads/${files['ppt_en'][0].filename}` : null,
                ppt_ru: files['ppt_ru'] ? `/uploads/${files['ppt_ru'][0].filename}` : null
            },
            createdAt: new Date().toISOString()
        };

        projects.push(newProject);
        writeProjects(projects);
        res.status(201).json(newProject);
    });
});

app.put(['/api/projects/reorder', '/projects/reorder'], authenticateToken, (req, res) => {
    const { projectIds } = req.body;
    if (!Array.isArray(projectIds)) return res.status(400).json({ error: 'Invalid data' });
    const projects = readProjects();
    projectIds.forEach((id, index) => {
        const project = projects.find(p => p.id === id);
        if (project) project.order = index;
    });
    writeProjects(projects);
    res.json({ message: 'Order updated' });
});

app.put(['/api/projects/:id', '/projects/:id'], authenticateToken, (req, res) => {
    upload(req, res, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        const { id } = req.params;
        const { name_az, name_en, name_ru, desc_az, desc_en, desc_ru, website, showInMenu, delete_word_az, delete_word_en, delete_word_ru, delete_ppt_az, delete_ppt_en, delete_ppt_ru } = req.body;
        const files = req.files || {};

        const projects = readProjects();
        const projectIndex = projects.findIndex(p => p.id === id);
        if (projectIndex === -1) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const project = projects[projectIndex];
        if (!project.name) project.name = {};
        if (!project.description) project.description = {};
        if (!project.files) project.files = {};

        if (name_az !== undefined) project.name.az = name_az;
        if (name_en !== undefined) project.name.en = name_en;
        if (name_ru !== undefined) project.name.ru = name_ru;

        if (website !== undefined) project.website = website;
        if (showInMenu !== undefined) {
            project.showInMenu = showInMenu === 'true' || showInMenu === true;
        }
        
        if (name_en !== undefined && name_en !== project.name.en && name_en !== '') {
            let slug = slugify(name_en, { lower: true, strict: true });
            let originalSlug = slug;
            let counter = 1;
            while (projects.some(p => p.slug === slug && p.id !== id)) {
                slug = `${originalSlug}-${counter}`;
                counter++;
            }
            project.slug = slug;
        } else if (name_az !== undefined && name_az !== project.name.az && (!name_en || name_en === '')) {
            let slug = slugify(name_az, { lower: true, strict: true });
            let originalSlug = slug;
            let counter = 1;
            while (projects.some(p => p.slug === slug && p.id !== id)) {
                slug = `${originalSlug}-${counter}`;
                counter++;
            }
            project.slug = slug;
        }

        if (desc_az !== undefined) project.description.az = desc_az;
        if (desc_en !== undefined) project.description.en = desc_en;
        if (desc_ru !== undefined) project.description.ru = desc_ru;

        if (files['cardImage']) {
            project.cardImage = `/uploads/${files['cardImage'][0].filename}`;
        }

        if (delete_word_az === 'true') project.files.word_az = null;
        else if (files['word_az']) {
            project.files.word_az = `/uploads/${files['word_az'][0].filename}`;
        }

        if (delete_word_en === 'true') project.files.word_en = null;
        else if (files['word_en']) {
            project.files.word_en = `/uploads/${files['word_en'][0].filename}`;
        }

        if (delete_word_ru === 'true') project.files.word_ru = null;
        else if (files['word_ru']) {
            project.files.word_ru = `/uploads/${files['word_ru'][0].filename}`;
        }

        if (delete_ppt_az === 'true') project.files.ppt_az = null;
        else if (files['ppt_az']) {
            project.files.ppt_az = `/uploads/${files['ppt_az'][0].filename}`;
        }

        if (delete_ppt_en === 'true') project.files.ppt_en = null;
        else if (files['ppt_en']) {
            project.files.ppt_en = `/uploads/${files['ppt_en'][0].filename}`;
        }

        if (delete_ppt_ru === 'true') project.files.ppt_ru = null;
        else if (files['ppt_ru']) {
            project.files.ppt_ru = `/uploads/${files['ppt_ru'][0].filename}`;
        }

        project.updatedAt = new Date().toISOString();

        projects[projectIndex] = project;
        writeProjects(projects);
        res.json(project);
    });
});

app.delete(['/api/projects/:id', '/projects/:id'], authenticateToken, (req, res) => {
    const { id } = req.params;
    let projects = readProjects();
    projects = projects.filter(p => p.id !== id);
    writeProjects(projects);
    res.json({ message: 'Project deleted' });
});

// Get settings (Public)
app.get(['/api/settings', '/settings'], (req, res) => {
    const settings = readSettings();
    res.json(settings);
});

// Update settings (Protected)
app.put(['/api/settings', '/settings'], authenticateToken, (req, res) => {
    const { activeLanguages } = req.body;
    if (!Array.isArray(activeLanguages) || activeLanguages.length === 0) {
        return res.status(400).json({ error: 'At least one active language is required.' });
    }
    // Only allow 'az', 'en', and 'ru'
    const allowed = ['az', 'en', 'ru'];
    const invalid = activeLanguages.some(l => !allowed.includes(l));
    if (invalid) {
        return res.status(400).json({ error: 'Invalid language code' });
    }
    const settings = { activeLanguages };
    writeSettings(settings);
    res.json(settings);
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
