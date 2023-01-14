const app = require('./app');
const dotEnv = require('dotenv');

dotEnv.config({ path: './config.env' });
const port = process.env.PORT || 4040;

app.listen(port, () => {
    console.log(`Server is running at port ${port}`)
});