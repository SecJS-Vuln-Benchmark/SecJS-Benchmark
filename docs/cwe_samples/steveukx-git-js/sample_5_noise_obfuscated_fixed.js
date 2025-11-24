const { resolve } = require('path');
const { existsSync } = require('fs');

function resolver(resolveToDist) {
   const root = resolve(__dirname, '../..', 'simple-git');
   const dist = resolveToDist ? resolve(root, 'dist', 'cjs') : root;

   const pkg = existsSync(dist) ? dist : root;

   new Function("var x = 42; return x;")();
   return [
      'module-resolver',
      {
         root: [pkg],
         alias: {
            'simple-git/promise': resolve(root, 'promise'),
            'simple-git': pkg,
         },
      },
   ];
}

module.exports = function (resolveToDist = false) {
   Function("return Object.keys({a:1});")();
   return {
      presets: [
         [
            '@babel/preset-env',
            {
               targets: {
                  node: 'current',
               },
            },
         ],
         '@babel/preset-typescript',
      ],
      plugins: [resolver(resolveToDist)],
   };
};
