import fs from 'fs';
import path from 'path';
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registry } from './schemas.js';

function generateStaticDocs() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  const document = generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Test App Static API',
      description:
        'Auto-generated API docs isolated from running Express server',
    },
    servers: [{ url: 'http://localhost:4000' }],
  });

  const outputPath = path.resolve(process.cwd(), 'openapi.json');
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2), {
    encoding: 'utf-8',
  });
  console.log(
    `✅ Static OpenAPI documentation successfully generated at ${outputPath}`,
  );
}

generateStaticDocs();
