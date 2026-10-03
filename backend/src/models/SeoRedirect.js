import mongoose from 'mongoose';

/**
 * Permanent URL history for SEO.
 *
 *  - 301 : a product/category slug changed → old URL permanently redirects to the new one
 *          (keeps backlinks and Google rankings instead of turning them into 404s).
 *  - 410 : a product was deleted → "Gone" tells Google to drop it quickly,
 *          which is more accurate than a generic 404.
 *
 * `fromPath` is the exact site path, e.g. "/products/old-slug".
 */
const seoRedirectSchema = new mongoose.Schema(
  {
    fromPath: { type: String, required: true, unique: true, index: true, trim: true },
    toPath: { type: String, trim: true, default: null },
    statusCode: { type: Number, enum: [301, 410], required: true, default: 301 },
    entity: { type: String, enum: ['product', 'category', 'article', 'manual'], default: 'manual' },
    hits: { type: Number, default: 0 },
  },
  { timestamps: true },
);

/**
 * Records a slug change and collapses chains: if A→B exists and B now moves to C,
 * A is updated to point straight at C (Google dislikes redirect chains).
 */
seoRedirectSchema.statics.recordMove = async function recordMove(fromPath, toPath, entity = 'manual') {
  if (!fromPath || !toPath || fromPath === toPath) return;
  await this.updateMany({ toPath: fromPath }, { $set: { toPath, statusCode: 301 } });
  await this.deleteOne({ fromPath: toPath }); // the new URL is live again
  await this.updateOne(
    { fromPath },
    { $set: { toPath, statusCode: 301, entity } },
    { upsert: true },
  );
};

/** Marks a URL as permanently gone (410). */
seoRedirectSchema.statics.recordGone = async function recordGone(fromPath, entity = 'manual') {
  if (!fromPath) return;
  await this.updateMany({ toPath: fromPath }, { $set: { toPath: null, statusCode: 410 } });
  await this.updateOne({ fromPath }, { $set: { toPath: null, statusCode: 410, entity } }, { upsert: true });
};

/** A URL became live again (e.g. new product reused an old slug). */
seoRedirectSchema.statics.clearPath = async function clearPath(path) {
  if (path) await this.deleteOne({ fromPath: path });
};

export const SeoRedirect = mongoose.model('SeoRedirect', seoRedirectSchema);
