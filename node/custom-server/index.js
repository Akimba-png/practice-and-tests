require('dotenv').config();
const App = require('./framework/app');
const userRouter = require('./src/user-router');
const { jsonParser, bodyParser, parseUrl } = require('./framework/middlewares.js');

const app = new App();
app.listen(process.env.PORT);
app.use(jsonParser);
app.use(bodyParser);
app.use(parseUrl(process.env.BASE_URL));
app.addRouter(userRouter);


// простейшая реализация сервера
// ------------------------------------------------------------------------------------------------
// const server = http.createServer((req, res) => {
//   res.writeHead(200, {'Content-Type': 'application/json'})
//   if (req.url === '/posts') {
//     res.end(JSON.stringify([{id: 1, title: 'title 1'}, {id: 2, title: 'title 2'}]));
//   }
//   if (req.url === '/users') {
//     res.end(JSON.stringify([{id: 1, name: 'me'}, {id: 2, name: 'me-again'}]));
//   }

// });
// server.listen(5000, () => console.log('server is listening'));
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------


// Структура endpoint
// const endpoints = {
//   '/posts': {
//     'GET': () => {},
//     'POST': () => {},
//   },
//   '/users': {
//     'GET': () => {},
//     'POST': () => {},
//   },
// };
