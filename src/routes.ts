import * as Express from 'express';
import { Btt } from 'btt';
import { execSync } from 'child_process';
import * as VM from 'vm';

const binaryPath: string = execSync('npm bin -g').toString();

const router = Express.Router();

router.post('/dynamic', async (req, res) => {
  const decodedPayload = JSON.parse(Buffer.from(req.body.payload, 'base64').toString('ascii'));

  const bttConfig = JSON.parse(decodedPayload.bttConfig);

  const remoteCb: string = decodedPayload.cb;

  // pass everything we need to the sanbox
  const sandbox = {
    binaryPath, bttConfig, Btt, setTimeout, setInterval, clearInterval, clearTimeout
  };

  // create a sanbox
  await VM.createContext(sandbox);

  new Btt(bttConfig).showNotification({ title: 'Done!', content: 'Callback started'}).invoke();

  // console.log((sandbox as any).btt);
  // invoke the requested function
  const code = `
    btt = new Btt(bttConfig);
    serverResponse = ((${remoteCb}).bind(btt))();
  `;

  await VM.runInContext(code, sandbox);

  // return the response
  const result = await (sandbox as any).serverResponse;

  res.json(result);
});

router.get('/builtin/binary/path', (req, res) => {
  res.send(binaryPath);
});

export default router;