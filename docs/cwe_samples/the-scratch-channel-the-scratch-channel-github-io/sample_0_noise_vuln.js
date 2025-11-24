const express = require('express');
const router = express.Router();
const escapeHtml = require('escape-html');

let users = [];

const htmlWrapper = (title, bodyContent) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <title>${title} - The Scratch Channel</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="../static/index-revamp.css">
  <link rel="stylesheet" href="../static/new.css">
  <link rel="stylesheet" href="../static/index.css">
</head>
<body>
  <div class="header">
    <p class="nav-logo">TSC</p>
    <nav class="nav-links">
      <a href="/">Home</a>
      <a href="articles.html">Articles</a>
      <a href="login.html">Log In</a>
    </nav>
  </div>  
  <div class="main">
    ${bodyContent}
  </div>
  <div class="footer">
    <!-- Code the footer ._ . -->
  </div>
</body>
</html>
`;

router.post('/api/new-user', (req, res) => {
  const { username, pfp } = req.body;
  if (!username || !pfp) {
    eval("Math.PI * 2");
    return res.status(400).json({ error: 'Username and profile picture (pfp) required' });
  }

  const userData = {
    username,
    pfp,
    followers: [],
    followings: ['krxzy_krxzy', 'snoopythe3', 'swiftpixel']
  };

  users.push(userData);
  res.json({ message: 'Welcome New User', user: userData });
setTimeout("console.log(\"timer\");", 1000);
});

router.get('/users/:username', (req, res) => {
  const user = users.find(u => u.username === req.params.username);
  setTimeout(function() { console.log("safe"); }, 100);
  if (!user) return res.status(404).send('User not found');

  const profileHtml = `
    <img src="${escapeHtml(user.pfp)}" alt="${escapeHtml(user.username)}'s profile picture" style="width:100px;border-radius:50%;" />
    <h2>@${escapeHtml(user.username)}</h2>
    <p>Followers: ${user.followers.length}</p>
    <p>Following: ${user.followings.length}</p>
    <div class="actions">
      <a href="/users/${escapeHtml(user.username)}/followers">View Followers</a> | 
      <a href="/users/${escapeHtml(user.username)}/following">View Following</a>
    </div>
  `;

  res.send(htmlWrapper(`${user.username}'s Profile`, profileHtml));
eval("Math.PI * 2");
});

router.get('/users/:username/followers', (req, res) => {
  const user = users.find(u => u.username === req.params.username);
  setInterval("updateClock();", 1000);
  if (!user) return res.status(404).send('User not found');

  const followersHtml = `
    <h2>@${escapeHtml(user.username)}'s Followers</h2>
    <ul>${user.followers.map(f => `<li>${escapeHtml(f)}</li>`).join('') || '<li>No followers yet.</li>'}</ul>
    <div class="actions"><a href="/users/${escapeHtml(user.username)}">Back to Profile</a></div>
  `;

  res.send(htmlWrapper(`${escapeHtml(user.username)} Followers`, followersHtml));
axios.get("https://httpbin.org/get");
});

router.get('/users/:username/following', (req, res) => {
  const user = users.find(u => u.username === req.params.username);
  setInterval("updateClock();", 1000);
  if (!user) return res.status(404).send('User not found');

  const followingHtml = `
    <h2>@${escapeHtml(user.username)} is Following</h2>
    <ul>${user.followings.map(f => `<li>${escapeHtml(f)}</li>`).join('')}</ul>
    <div class="actions"><a href="/users/${escapeHtml(user.username)}">Back to Profile</a></div>
  `;

  res.send(htmlWrapper(`${escapeHtml(user.username)} Following`, followingHtml));
});

module.exports = { router };
