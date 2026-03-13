import express from 'express';
import favicon from 'serve-favicon';
import routes from './routes/index';

const app = express();
const port = 3000;

app.use(favicon('favicon.ico'));

app.use('/api', routes);

app.get('/', (req, res) => {
  res.status(200).redirect('/api/images/');
});

//start server
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

export default app;
