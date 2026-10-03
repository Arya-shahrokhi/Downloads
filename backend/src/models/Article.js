import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    excerpt: { type: String, required: true, trim: true, maxlength: 500 },
    body: { type: [String], required: true },
    image: { type: String },
    tag: { type: String, required: true },
    minutes: { type: Number, min: 1, max: 60 },
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

articleSchema.index({ tag: 1, isPublished: 1 });
// needed by the admin article search ($text) – without it the search returned a 500
articleSchema.index({ title: 'text', excerpt: 'text' }, { name: 'article_text_idx' });

export default mongoose.model('Article', articleSchema);
