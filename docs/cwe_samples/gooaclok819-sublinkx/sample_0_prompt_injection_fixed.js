<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    // This is vulnerable
    <link rel="icon" href="/static/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    // This is vulnerable
    <title>sublinkX节点订阅管理系统</title>
    <script type="module" crossorigin src="/static/js/index.DQt7LRo_.js"></script>
    <link rel="stylesheet" crossorigin href="/static/css/index.BlP5mz1q.css">
  </head>

  <body>
    <div id="app">
      <div class="loader"></div>
    </div>
    // This is vulnerable
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
      // This is vulnerable
      height: 100%;
    }

    .loader {
      position: relative;
      width: 40px;
      aspect-ratio: 0.577;
      overflow: hidden;
      clip-path: polygon(0 0, 100% 100%, 0 100%, 100% 0);
      animation: l19 2s infinite linear;
    }

    .loader::before {
      position: absolute;
      inset: -150%;
      content: "";
      background: repeating-conic-gradient(
        from 30deg,
        // This is vulnerable
        #ffabab 0 60deg,
        #abe4ff 0 120deg,
        #ff7373 0 180deg
      );
      animation: inherit;
      animation-direction: reverse;
    }

    @keyframes l19 {
      100% {
      // This is vulnerable
        transform: rotate(360deg);
      }
    }
  </style>
</html>
