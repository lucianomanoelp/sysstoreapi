const app = require('./src/config/express-config');

const PORT = 21046;

app.listen(PORT, () => console.log(`sysstoreapi escutando na porta ${PORT}`));