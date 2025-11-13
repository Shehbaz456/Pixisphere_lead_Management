/**
 * Application logger utility
 * Can be extended to use Winston or Pino in production
 */
class Logger {
  static info(message, meta = {}) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta);
  }

  static error(message, error = {}) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, {
      message: error.message,
      stack: error.stack,
    });
  }

  static warn(message, meta = {}) {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta);
  }

  static debug(message, meta = {}) {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, meta);
    }
  }
}

export { Logger };
