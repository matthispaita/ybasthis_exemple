'use strict';

const interpreter = ((IIO) => () => IIO.question
(
   '[c=close | rd=reload-remote]\n>', res =>
    {
        if (interpreter[res])
            interpreter[res]();
        else
        {
            console.log('Bad answer!');
            interpreter();
        }
    }
))(require('readline').createInterface
({
    input:  process.stdin,
    output: process.stdout
}));
interpreter.c = () => process.exit(0);
interpreter.rd = (cp => () => cp.exec
(
    'node_modules/.bin/webpack --config ./configuration/webPack.js',
    {
        env : process.env,
        stdio: 'pipe',
    },
    (a, b, c) =>  (console.log(b), interpreter())
))(require('child_process'));
const app = (express =>
{
    const app = express();
    app.use(express.static('remote/'));
    return (app);
})(require('express'));
const server = require('http').createServer(app);
server.listen(24000);
interpreter();