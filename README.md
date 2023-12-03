[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)


# Simple URL Shortener API + Client

A straightforward URL shortener project built with Express.js, Redis, and TypeScript.

Check client demo at: https://url-shortner-jldn.onrender.com/

## Getting Started

### Prerequisites

- Node.js and npm installed
- Redis server running locally or at a specified endpoint

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/url-shortener.git
   cd url-shortener
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your environment variables:

   Create a `.env` file in the root of the project and configure the following variables:

   ```env
   REDIS_HOST=localhost
   REDIS_PORT=6379
   PORT=3000
   ```

   Adjust the values based on your Redis server configuration.

4. Run the development server:

   ```bash
   npm run dev
   ```

   The API will be accessible at `http://localhost:3000`.

## Interacting with the API

You can interact with the URL shortener API by sending HTTP requests. Here are the available endpoints:

### 1. Shorten a URL (POST)

Send a POST request to 'https://url-shortner-api-t5uy.onrender.com' or, if running locally, `http://localhost:3000` with the following JSON payload:

```json
POST http://localhost:3000

{
  "url": "https://www.google.com.br"
}
```

#### Response:

The API will return a response with the original URL and its shortened version:

```json
{
  "long-url": "https://www.google.com.br/",
  "short-url": "http://localhost:3000/70j"
}
```

### 2. Redirect to Original URL (GET)

To access the original URL from the shortened version, send a GET request to `http://localhost:3000/<HASH>` or short-url provided when shortening a new URL. Replace `<HASH>` with the actual hash generated when shortening the URL.

#### Example:

```bash
GET http://localhost:3000/<HASH>
```

#### Redirect:

The API will redirect you to the original URL that corresponds to the provided hash.

Feel free to customize the endpoint paths and add more details based on your actual implementation. Make sure to provide clear examples and instructions for users to interact with your URL shortener API.

## Scripts

- `npm run dev`: Run the development server with automatic restarts using Nodemon.
- `npm run build`: Install dependencies and compile TypeScript code into JavaScript.
- `npm start`: Start service from build (used for deploying purposes)

Happy URL shortening! If you encounter any issues or have suggestions, please let us know.