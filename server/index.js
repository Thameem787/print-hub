// Local dev server entry point
import app, { connectDB } from './app.js';

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀  PrintHub API running at http://localhost:${PORT}`);
    console.log(`   Health check → http://localhost:${PORT}/api/health\n`);
  });
});
