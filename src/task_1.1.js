import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});

rl.on('line', line => {
    const reverseString = line.split('').reverse().join('')
    rl.output.write(reverseString+'\n');
});