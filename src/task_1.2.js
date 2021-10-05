import fs from 'fs';
import csv from 'csvtojson';

const readStream = fs.createReadStream('src/doc/example.csv');
const writeStream = fs.createWriteStream('src/doc/example.txt', 'utf-8')

csv()
    .fromStream(readStream.on('error',err => console.log(err)))
    .on('data',data => writeStream.write(data.toString('utf8')))
    .on('error',err => console.log(err))


