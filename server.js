const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Africa's Talking can POST as form-encoded or JSON — accept both.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/ussd', (req, res) => {
  // Accept fields whether sent as form or JSON
  const sessionId = req.body.sessionId || req.body.session_id || '';
  const serviceCode = req.body.serviceCode || req.body.service_code || '';
  const phoneNumber = req.body.phoneNumber || req.body.phone_number || '';
  const text = req.body.text || '';

  console.log('USSD request', { sessionId, serviceCode, phoneNumber, text });

  // Simple menu flow example
  if (text === '') {
    // First request
    res.set('Content-Type', 'text/plain');
    return res.send('CON Welcome to Demo\n1. Register\n2. Check Balance');
  }

  if (text === '1') {
    res.set('Content-Type', 'text/plain');
    return res.send('CON Enter name:');
  }

  if (text.startsWith('1*')) {
    const name = text.split('*')[1];
    res.set('Content-Type', 'text/plain');
    return res.send(`END Thanks ${name}, you've been registered.`);
  }

  if (text === '2') {
    res.set('Content-Type', 'text/plain');
    return res.send('END Your balance is NGN 1,200');
  }

  // Fallback
  res.set('Content-Type', 'text/plain');
  return res.send('END Invalid option');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`USSD app listening on port ${port}`);
});
