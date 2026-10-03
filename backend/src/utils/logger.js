const logger = {
  info: (msg, meta = {}) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[INFO] ${new Date().toISOString()} - ${msg}`, Object.keys(meta).length ? meta : '');
    }
  },
  warn: (msg, meta = {}) => {
    if (process.env.NODE_ENV !== 'test') {
      console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`, Object.keys(meta).length ? meta : '');
    }
  },
  error: (msg, error = {}) => {
    if (process.env.NODE_ENV !== 'test') {
      console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`, error);
    }
  }
};

module.exports = logger;
