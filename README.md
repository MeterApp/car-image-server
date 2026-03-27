# Car Image Server

AI-generated car images with transparent backgrounds, powered by OpenAI and cached on Vercel.

## Self-Hosting on Vercel

### Prerequisites

- Node.js 18+
- A [Vercel](https://vercel.com) account
- An [OpenAI API key](https://platform.openai.com/api-keys) with image generation access

### Setup

1. **Clone the repo**

   ```bash
   git clone git@github.com:MeterApp/car-image-server.git
   cd car-image-server
   npm install
   ```

2. **Link to Vercel**

   ```bash
   npx vercel link
   ```

   When prompted, create a new project.

3. **Create a Blob store**

   ```bash
   npx vercel blob store add
   ```

   Give it a name (e.g. `car-imgs`). This auto-sets `BLOB_READ_WRITE_TOKEN` for deployed environments.

4. **Add your OpenAI API key**

   ```bash
   npx vercel env add OPENAI_API_KEY
   ```

   Paste your key and select all environments (Production, Preview, Development).

5. **Pull env vars for local dev**

   ```bash
   npx vercel env pull .env.local
   ```

6. **Run locally**

   ```bash
   npm run dev
   ```

   Open http://localhost:3000 to see the homepage with API docs.

7. **Deploy**

   ```bash
   npx vercel --prod
   ```

### Environment Variables

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | OpenAI API key for image generation |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob store token (auto-set when you create a store) |

## API Usage

```
GET /images/car.png?view=side&brand=toyota&model=corolla&year=2012
```

### Parameters

| Param | Required | Description |
|---|---|---|
| `view` | Yes | `side` or `front` |
| `brand` | Yes | Car manufacturer (e.g. `toyota`, `bmw`, `tesla`) |
| `model` | Yes | Car model (e.g. `corolla`, `m3`, `model-3`) |
| `year` | Yes | Model year (1990 to current year + 1) |
| `color` | No | Car color (default: `silver`) |
| `w` | No | Resize width in pixels (1-1024) |
| `h` | No | Resize height in pixels (1-1024) |

### Examples

```
/images/car.png?view=side&brand=porsche&model=911&year=2024&color=red
/images/car.png?view=front&brand=tesla&model=model-3&year=2023&color=white
/images/car.png?view=side&brand=bmw&model=m3&year=2022&color=blue&w=256
```

### Caching

Images are cached at two layers:

1. **Vercel Blob Storage** - persistent cache, survives redeployments
2. **Vercel Edge CDN** - `Cache-Control: s-maxage=31536000` (1 year)

The first request for a unique car/view/color combination generates the image via OpenAI (takes a few seconds). All subsequent requests are served from cache.

### Response

- **200** - PNG image with transparent background
- **400** - Invalid or missing parameters (JSON error)
- **502** - Image generation failed (JSON error)
