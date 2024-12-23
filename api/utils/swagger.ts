import fs from 'fs';
import path from 'path';
import YAML from 'yamljs';

interface SwaggerDocument {
  openapi: string;
  info: {
    title: string;
    version: string;
  };
  servers: Server[];
  paths: {
    [key: string]: object;
  };
  components?: {
    securitySchemes?: {
      [key: string]: {
        type: string;
        scheme: string;
        bearerFormat?: string;
      };
    };
  };
  security?: { [key: string]: string[] }[];
}

interface Server {
  url: string;
  description: string;
}

const loadSwaggerFiles = (): SwaggerDocument => {
  const modulesDir = path.join(__dirname, '../modules');
  const modules = fs.readdirSync(modulesDir);

  const swaggerDocs: SwaggerDocument[] = modules
    .map((module) => {
      const swaggerPath = path.join(modulesDir, module, 'swagger.yaml');
      if (fs.existsSync(swaggerPath)) {
        return YAML.load(swaggerPath) as SwaggerDocument;
      }
      return null;
    })
    .filter((doc): doc is SwaggerDocument => doc !== null);

  const mergedPaths = swaggerDocs.reduce((acc, doc) => ({ ...acc, ...doc.paths }), {});

  return {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:9000/api',
        description: 'docker server',
      },
      {
        url: 'http://localhost:3000/api',
        description: 'local server',
      },
    ],
    paths: mergedPaths,
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Optional, adds clarity for the token format
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  };
};

export default loadSwaggerFiles;
