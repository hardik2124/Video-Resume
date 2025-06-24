
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const envPath = process.env.NODE_ENV === 'production'
  ? path.resolve('./.env.production')
  : path.resolve('./.env.development');

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log(`✅ Loaded environment from ${envPath}`);
} else {
  console.warn(`⚠️ No env file found at ${envPath}`);
}
