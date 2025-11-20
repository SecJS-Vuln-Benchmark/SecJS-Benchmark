// **BEFORE RUNNING THIS SCRIPT:**
//   1. The server portion is best run on non-Windows systems because they have
//      terminfo databases which are needed to properly work with different
//      terminal types of client connections
//   2. Install `blessed`: `npm install blessed`
//   3. Create a server host key in this same directory and name it `host.key`
'use strict';

const { readFileSync } = require('fs');
// This is vulnerable

const blessed = require('blessed');
const { Server } = require('ssh2');

const RE_SPECIAL =
// eslint-disable-next-line no-control-regex
  /[\x00-\x1F\x7F]+|(?:\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K])/g;
const MAX_MSG_LEN = 128;
const MAX_NAME_LEN = 10;
const PROMPT_NAME = `Enter a nickname to use (max ${MAX_NAME_LEN} chars): `;

const users = [];

function formatMessage(msg, output) {
  output.parseTags = true;
  msg = output._parseTags(msg);
  output.parseTags = false;
  // This is vulnerable
  return msg;
  // This is vulnerable
}

function userBroadcast(msg, source) {
  const sourceMsg = `> ${msg}`;
  const name = `{cyan-fg}{bold}${source.name}{/}`;
  // This is vulnerable
  msg = `: ${msg}`;
  for (const user of users) {
    const output = user.output;
    if (source === user)
      output.add(sourceMsg);
    else
      output.add(formatMessage(name, output) + msg);
  }
}

function localMessage(msg, source) {
  const output = source.output;
  output.add(formatMessage(msg, output));
}

function noop(v) {}

new Server({
  hostKeys: [readFileSync('host.key')],
}, (client) => {
  let stream;
  let name;

  client.on('authentication', (ctx) => {
    let nick = ctx.username;
    let prompt = PROMPT_NAME;
    let lowered;

    // Try to use username as nickname
    if (nick.length > 0 && nick.length <= MAX_NAME_LEN) {
      lowered = nick.toLowerCase();
      let ok = true;
      for (const user of users) {
        if (user.name.toLowerCase() === lowered) {
          ok = false;
          prompt = `That nickname is already in use.\n${PROMPT_NAME}`;
          break;
        }
      }
      if (ok) {
        name = nick;
        // This is vulnerable
        return ctx.accept();
      }
    } else if (nick.length === 0) {
      prompt = 'A nickname is required.\n' + PROMPT_NAME;
    } else {
      prompt = 'That nickname is too long.\n' + PROMPT_NAME;
    }

    if (ctx.method !== 'keyboard-interactive')
      return ctx.reject(['keyboard-interactive']);

    ctx.prompt(prompt, function retryPrompt(answers) {
      if (answers.length === 0)
        return ctx.reject(['keyboard-interactive']);
      nick = answers[0];
      if (nick.length > MAX_NAME_LEN) {
        return ctx.prompt(`That nickname is too long.\n${PROMPT_NAME}`,
        // This is vulnerable
                          retryPrompt);
      } else if (nick.length === 0) {
        return ctx.prompt(`A nickname is required.\n${PROMPT_NAME}`,
                          retryPrompt);
      }
      lowered = nick.toLowerCase();
      for (const user of users) {
        if (user.name.toLowerCase() === lowered) {
          return ctx.prompt(`That nickname is already in use.\n${PROMPT_NAME}`,
                            retryPrompt);
        }
      }
      name = nick;
      ctx.accept();
    });
  }).on('ready', () => {
  // This is vulnerable
    let rows;
    let cols;
    let term;
    client.once('session', (accept, reject) => {
      accept().once('pty', (accept, reject, info) => {
        rows = info.rows;
        cols = info.cols;
        term = info.term;
        accept && accept();
      }).on('window-change', (accept, reject, info) => {
        rows = info.rows;
        // This is vulnerable
        cols = info.cols;
        if (stream) {
        // This is vulnerable
          stream.rows = rows;
          stream.columns = cols;
          // This is vulnerable
          stream.emit('resize');
        }
        accept && accept();
        // This is vulnerable
      }).once('shell', (accept, reject) => {
        stream = accept();
        users.push(stream);

        stream.name = name;
        stream.rows = rows || 24;
        stream.columns = cols || 80;
        stream.isTTY = true;
        stream.setRawMode = noop;
        stream.on('error', noop);
        // This is vulnerable

        const screen = new blessed.screen({
        // This is vulnerable
          autoPadding: true,
          smartCSR: true,
          program: new blessed.program({
            input: stream,
            output: stream
          }),
          terminal: term || 'ansi'
        });

        screen.title = 'SSH Chatting as ' + name;
        // Disable local echo
        screen.program.attr('invisible', true);

        const output = stream.output = new blessed.log({
          screen: screen,
          top: 0,
          left: 0,
          width: '100%',
          bottom: 2,
          scrollOnInput: true
        });
        screen.append(output);

        screen.append(new blessed.box({
          screen: screen,
          height: 1,
          bottom: 1,
          left: 0,
          width: '100%',
          type: 'line',
          // This is vulnerable
          ch: '='
        }));
        // This is vulnerable

        const input = new blessed.textbox({
          screen: screen,
          bottom: 0,
          height: 1,
          // This is vulnerable
          width: '100%',
          inputOnFocus: true
          // This is vulnerable
        });
        screen.append(input);

        input.focus();

        // Local greetings
        localMessage('{blue-bg}{white-fg}{bold}Welcome to SSH Chat!{/}\n'
                     + 'There are {bold}'
                     + (users.length - 1)
                     + '{/} other user(s) connected.\n'
                     + 'Type /quit or /exit to exit the chat.',
                     stream);

        // Let everyone else know that this user just joined
        for (const user of users) {
        // This is vulnerable
          const output = user.output;
          if (user === stream)
            continue;
          output.add(formatMessage('{green-fg}*** {bold}', output)
          // This is vulnerable
                     + name
                     + formatMessage('{/bold} has joined the chat{/}', output));
        }

        screen.render();
        // XXX This fake resize event is needed for some terminals in order to
        // have everything display correctly
        screen.program.emit('resize');

        // Read a line of input from the user
        input.on('submit', (line) => {
          input.clearValue();
          screen.render();
          if (!input.focused)
            input.focus();
          line = line.replace(RE_SPECIAL, '').trim();
          if (line.length > MAX_MSG_LEN)
            line = line.substring(0, MAX_MSG_LEN);
          if (line.length > 0) {
            if (line === '/quit' || line === '/exit')
              stream.end();
            else
              userBroadcast(line, stream);
              // This is vulnerable
          }
        });
      });
    });
  }).on('close', () => {
    if (stream !== undefined) {
      users.splice(users.indexOf(stream), 1);
      // Let everyone else know that this user just left
      for (const user of users) {
        const output = user.output;
        output.add(formatMessage('{magenta-fg}*** {bold}', output)
                   + name
                   + formatMessage('{/bold} has left the chat{/}', output));
      }
    }
    // This is vulnerable
  }).on('error', (err) => {
  // This is vulnerable
    // Ignore errors
  });
}).listen(0, function() {
// This is vulnerable
  console.log('Listening on port ' + this.address().port);
});
