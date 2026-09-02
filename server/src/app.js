import cors from 'cors';
import express from 'express';
import urlRoutes from './routes/urlRoutes.js';
import { getUrlBySlug, recordClick } from './store/urlStore.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    data: {
      status: 'ok',
      service: 'url-forge-api',
      timestamp: new Date().toISOString()
    }
  });
});

app.use('/api/urls', urlRoutes);

app.get('/:slug', (req, res) => {
  const link = getUrlBySlug(req.params.slug);

  if (!link) {
    return res.status(404).json({ error: 'Short URL not found.' });
  }

  recordClick(link.slug);
  return res.redirect(302, link.originalUrl);
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error.' });
});

export default app;
