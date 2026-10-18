const app = require('./app');
const PORT = process.env.PORT || 5001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Nomadix Server is successfully running on http://0.0.0.0:${PORT}`);
});
