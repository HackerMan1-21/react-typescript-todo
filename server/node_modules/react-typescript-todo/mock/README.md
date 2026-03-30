# GTA Mock Server

Run a simple mock API that serves JSON files in `mock/vehicles`.

Install and start:

```bash
cd mock
npm install
npm start
```

Endpoints:
- `GET /api/vehicles` — list summaries
- `GET /api/vehicles/slug/:slug` — full vehicle detail (loads `mock/vehicles/:slug.json`)
- `GET /api/vehicles/:id` — find by id
- `GET /api/templates` — aggregated templates from vehicle files
