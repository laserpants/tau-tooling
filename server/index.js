const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const port = 3102;
const cmd = '/home/laserpants/code/tau/sandbox5/.stack-work/dist/x86_64-linux-tinfo6/Cabal-3.2.1.0/build/tau-exe/tau-exe';

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


app.post('/run', (req, res) => {
  exec(`${cmd} "${req.body.source}"`, (error, stdout, stderr) => {
    console.log(stdout);
    res.json({});
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
});