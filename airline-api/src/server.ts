import app from './app';

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`[Server] Airline API is running on port ${PORT}`);
  console.log(`[Server] Health check: http://localhost:${PORT}/health`);
});

process.on('unhandledRejection', (err: any) => {
  console.error(`[Unhandled Rejection] ${err.name}: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
