import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
    description: { type: String, trim: true, maxlength: 500 },
    icon: { type: String, trim: true, default: 'leaf' },
    image: { url: String, publicId: String },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null, index: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },

    // --- SEO (optional). Empty = editorial defaults from shared/seo/categoryContent.js ---
    seoTitle: { type: String, trim: true, maxlength: 90, default: '' },
    seoDescription: { type: String, trim: true, maxlength: 200, default: '' },
    // Longer introduction shown on the category page. Paragraphs separated by a blank line.
    intro: { type: String, trim: true, maxlength: 5000, default: '' },
    // Visible FAQ block on the category page (also emitted as FAQPage JSON-LD).
    faqs: {
      type: [new mongoose.Schema({
        question: { type: String, trim: true, maxlength: 200, required: true },
        answer: { type: String, trim: true, maxlength: 1200, required: true },
      }, { _id: false })],
      default: [],
    },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

categorySchema.index({ name: 'text' });

export const Category = mongoose.model('Category', categorySchema);
