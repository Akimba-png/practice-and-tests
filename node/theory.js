const path = require('path');
const fs = require('fs');
const os = require('os');
const Emitter = require('events');
const http = require('http');


// ------------------------------------------------------------------------------------------------
// cross-env - пакет для передачи переменных окружения через CLI
// Для запуска npm cross-env TEXT='new text' node test.js
// dotenv - пакет, который позволяет передавать переменные окружения через файл .env
// nodemon - пакет, который перезагружает сервер, на каждое изменение в редакторе (nodemon test.js)
const text = process.env.TEXT ?? 'nothing here';
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------


// URL - глобальный модуль для работы с url
// ------------------------------------------------------------------------------------------------
new URL('http://localhost:5000/users')
// имортировать модуль не нужно, требует указания полного url (начиная от http)
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------


// fs - модуль для работы с файловой системой
// ------------------------------------------------------------------------------------------------
const makeDirAsync = (dirName = 'newDir') => {
  return new Promise((resolve, reject) => {
    fs.mkdir(path.resolve(dirName), (error) => {
      if (error) { reject(error) }
      resolve();
    })
  })
};

const makeFileAsync = () => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.resolve('newDir', 'text.txt'), 'new text', (error) => {
      if (error)  { reject(error) }
      resolve();
    })
  });
};

const appendFileAsync = () => {
  return new Promise((resolve, reject) => {
    fs.appendFile(path.resolve('newDir', 'text.txt'), ' the newest text', (error) => {
      if (error) { reject(error) }
      resolve();
    });
  });
};

const readFileAsync = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve('newDir', 'text.txt'), {encoding: 'utf-8'}, (error, data) => {
      if (error) { reject(error) }
      resolve(data);
    });
  });
};

const removeDirAsync = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fs.rm(path.resolve('newDir'), {recursive: true}, (error) => {
        if (error) { reject(error) }
        resolve();
      });
    }, 10000);
  });
};

// makeDirAsync()
//   .then(() => makeFileAsync())
//   .then(() => appendFileAsync())
//   .then(() => readFileAsync())
//   .then((data) => console.log(data))
//   .then(() => removeDirAsync());
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------


// os - модуль для работы с операционной системой
// ------------------------------------------------------------------------------------------------
os.cpus();
os.freemem();
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------


// events - модуль для работы с событиями
// ------------------------------------------------------------------------------------------------
const emitter = new Emitter();
emitter.on('connect', (a, b, c, ...args) => {
  console.log(a);
  console.log(b);
});

emitter.emit('connect', 1, 'test');
emitter.emit('connect', 2, 'anotherTest');
const emitted = emitter.emit('unknown-emit', null)
if (emitted) {}
// если генерируемое событие не существует (т.е на него нет подиписок)
// то возвращаемое значение emitter.emit - будет false;

emitter.once('EventFiresOneTime', (...args) => { console.log(args)} );

const onRequestReceive = (...args) => { console.log(args) };
emitter.on('request', onRequestReceive);
emitter.removeListener('request', onRequestReceive);
emitter.removeAllListeners();
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------


// fs - модуль для работы со стримами
// ------------------------------------------------------------------------------------------------
// в node.js 4-ре вида стримов:
// 1 - readable
// 2 - writable
// 3 - duplex
// 4 - transform
// по умолчанию вес одного стрима 64кб

fs.readFile(path.resolve('text.txt'), (error, data) => {
  if(error) { console.log(error) }
  console.log(data);
});
// ^ файл будет прочитан за один раз,
// при этом если вес файла будет очень большой
// его нельзя будет никуда передать, до момента его полного прочтения

const stream = fs.createReadStream(path.resolve('text.txt'), {encoding: 'utf-8'});
// стримы работают по принципу событий:
stream.on('data', (chunk) => { console.log(chunk) } );
// ^ файл будет отдаваться по мере прочтения,
// чанками по 64 кб
stream.on('error', (error) => { console.log(error)} );
// ^ ВАЖНО! у стримов обязательно обрабатывать ошибки, если это не делать,
// то может упасть весь node.js процесс

const writableStream = fs.createWriteStream(path.resolve(__dirname, text.txt));
for (let i = 0; i < 20; i++) {
  writableStream.write(i + '\n');
}
writableStream.end();
// ^ будет создан новый файл и в него по кусочками будет записана информация из цикла.
// ВАЖНО! в ручную закрывать стримы c помощью метода end();

// в модуле http, при создании сервера req и res - так же являются стримами
{const server = http.createServer((req, res) => {
  const stream = fs.createReadStream(path.resolve(__dirname, 'text.txt'));
  stream.on('data', (chunk) => { res.write(chunk) });
  stream.on('end', () => res.end());
  // stream.pipe(res);
});}
// ^ в данном случае мы считываем файл из файловой системы, с помощью readable-стрима,
// и так же по кусочкам передаём его на клиент, т.к res.write - так же является стримом
// по завершению чтения файла из файловой системы - закрываем записывающий стрим

// ВАЖНО! ^ данные экземпляр стимов будет работать некорректно.
// Т.к. стрим чтения из файла отработает быстрее, чем стрим передачи по сети.
// В результате стримы будут закрыты до момента, когда все чанки будут отправлены.

// Чтобы этого избежать существует метод stream.pipe(res), в который следует передать
// writableStream. (закоментированая строчка в коде).
// Таким образом мы синхронизируем readable и writeable streams.
// readable stream не начнёт читать очередную порцию, пока writable stream не запишет предыдующую.
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
