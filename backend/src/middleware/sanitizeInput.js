const SCRIPT_BLOCK = /<\s*(script|style)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi;
const TAG = /<[^>]*>/g;

const cleanString = (value) =>
  value
    .replace(SCRIPT_BLOCK, '')
    .replace(TAG, '')
    .trim();

const clean = (value, depth = 0) => {
  if (depth > 12) return value;
  if (typeof value === 'string') return cleanString(value);
  if (Array.isArray(value)) return value.map((item) => clean(item, depth + 1));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [cleanString(key), clean(item, depth + 1)]),
    );
  }
  return value;
};

export const sanitizeRequest = (req, _res, next) => {
  // Body parsers run before this middleware in app.js. Query and params are
  // sanitized too, while parameter names remain controlled by route code.
  if (req.body && typeof req.body === 'object') req.body = clean(req.body);
  if (req.query && typeof req.query === 'object') req.query = clean(req.query);
  if (req.params && typeof req.params === 'object') req.params = clean(req.params);
  return next();
};
