import { Product } from '../backend/src/models/Product.js';
import { connectDB, disconnectDB } from '../backend/src/config/db.js';

await connectDB();
const expected = 183;
const actual = await Product.countDocuments();
if (actual !== expected) {
  throw new Error(`MongoDB smoke test expected ${expected} products, found ${actual}`);
}
console.log(`PASS: real MongoDB contains ${actual} seeded products`);
await disconnectDB();
