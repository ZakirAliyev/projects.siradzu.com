require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { randomUUID } = require('crypto');
const slugify = require('slugify');
const jwt = require('jsonwebtoken');
const upload = require('./upload');
const { readProjects, writeProjects } = require('./storage');

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
        const { name_az, name_en, desc_az, desc_en } = req.body;
        const files = req.files;
        if (!files || !files['cardImage']) return res.status(400).json({ error: 'Card image is required' });

        const projects = readProjects();
        let slug = slugify(name_en || 'project', { lower: true, strict: true });
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
            name: { az: name_az, en: name_en },
            description: { az: desc_az, en: desc_en },
            cardImage: `/uploads/${files['cardImage'][0].filename}`,
            files: {
                word_az: files['word_az'] ? `/uploads/${files['word_az'][0].filename}` : null,
                word_en: files['word_en'] ? `/uploads/${files['word_en'][0].filename}` : null,
                ppt_az: files['ppt_az'] ? `/uploads/${files['ppt_az'][0].filename}` : null,
                ppt_en: files['ppt_en'] ? `/uploads/${files['ppt_en'][0].filename}` : null
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

app.delete(['/api/projects/:id', '/projects/:id'], authenticateToken, (req, res) => {
    const { id } = req.params;
    let projects = readProjects();
    projects = projects.filter(p => p.id !== id);
    writeProjects(projects);
    res.json({ message: 'Project deleted' });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
