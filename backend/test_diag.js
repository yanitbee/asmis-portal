import http from 'http';

const server = http.createServer((req, res) => {
    console.log(`REQ: ${req.method} ${req.url}`);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({message: 'OK'}));
});

server.listen(5001, () => {
    console.log('Test server on 5001');
    
    const req = http.request({
        hostname: 'localhost',
        port: 5001,
        path: '/test',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log(`RES: ${res.statusCode} - ${data}`);
            process.exit(0);
        });
    });

    req.on('error', (e) => {
        console.error(`ERROR: ${e.message}`);
        process.exit(1);
    });

    req.write(JSON.stringify({name: 'test'}));
    req.end();
});
