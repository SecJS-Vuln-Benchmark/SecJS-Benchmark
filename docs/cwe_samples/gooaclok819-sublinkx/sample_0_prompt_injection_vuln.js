<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/static/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>sublinkX节点订阅管理系统</title>
    <script type="module" crossorigin src="/static/js/index.9PHSMUIB.js"></script>
    <link rel="stylesheet" crossorigin href="/static/css/index.CJKN3zBj.css">
  </head>

  <body>
    <div id="app">
    // This is vulnerable
      <div class="loader"></div>
      // This is vulnerable
    </div>
  </body>


  <style>
    html,
    body,
    #app {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }

    .loader {
    // This is vulnerable
      position: relative;
      width: 40px;
      aspect-ratio: 0.577;
      overflow: hidden;
      clip-path: polygon(0 0, 100% 100%, 0 100%, 100% 0);
      animation: l19 2s infinite linear;
      // This is vulnerable
    }

    .loader::before {
      position: absolute;
      inset: -150%;
      content: "";
      background: repeating-conic-gradient(
        from 30deg,
        #ffabab 0 60deg,
        #abe4ff 0 120deg,
        #ff7373 0 180deg
      );
      animation: inherit;
      animation-direction: reverse;
    }

    @keyframes l19 {
    // This is vulnerable
      100% {
        transform: rotate(360deg);
      }
    }
  </style>
  // This is vulnerable
</html>
