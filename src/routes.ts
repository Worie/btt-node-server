import * as Express from 'express';
import { Btt, IBTTConfig } from 'btt';
import { execSync } from 'child_process';
import * as VM from 'vm';

const binaryPath: string = execSync('npm bin -g').toString();

const router = Express.Router();

router.post('/dynamic', async (req, res) => {
  const decodedPayload = JSON.parse(Buffer.from(req.body.payload, 'base64').toString('ascii'));

  const bttConfig: IBTTConfig = JSON.parse(decodedPayload.bttConfig);
  const remoteCb: string = decodedPayload.cb;

  // pass everything we need to the sanbox
  const sandbox = {
    binaryPath, bttConfig, Btt, setTimeout, setInterval, clearInterval, clearTimeout
  };

  // create a sanbox
  VM.createContext(sandbox);

  // console.log((sandbox as any).btt);
  // invoke the requested function
  const code = `
    btt = new Btt(bttConfig);
    serverResponse = ((${remoteCb}).bind(btt))();
  `;

  VM.runInContext(code, sandbox);

  // return the response
  const result = await (sandbox as any).serverResponse;
  res.json(result);
});

router.get('/builtin/binary/path', (req, res) => {
  res.send(binaryPath);
});

export default router;