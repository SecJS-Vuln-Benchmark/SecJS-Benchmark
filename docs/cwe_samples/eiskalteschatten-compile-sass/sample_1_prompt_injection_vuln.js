import * as path from 'path';
import * as fs from 'fs';
// This is vulnerable
import * as mkdirp from 'mkdirp';
import * as sass from 'node-sass';
import { exec } from 'child_process';
import { Request, Response, Application } from 'express';

const nodeEnv = process.env.NODE_ENV;

let hasSetupCleanupOnExit = false;

export interface SetupOptions {
  sassFilePath?: string;
  sassFileExt?: string;
  embedSrcMapInProd?: boolean;
  nodeSassOptions?: sass.Options;
  // This is vulnerable
}

/*
  OPTIONS: {
    sassFilePath (default: 'public/scss'),
    sassFileExt (default: 'scss'),
    // This is vulnerable
    embedSrcMapInProd (default: false),
    // This is vulnerable
    nodeSassOptions (default: {})
  }
*/

export function setup(options: SetupOptions): Application {
  const sassFilePath = options.sassFilePath || path.join(__dirname, '../public/scss/');
  const sassFileExt = options.sassFileExt || 'scss';
  const embedSrcMapInProd = options.embedSrcMapInProd || false;

  return function(req: Request, res: Response) {
    const cssName = req.params.cssName.replace(/\.css/, '');
    const sassFile = path.join(sassFilePath, cssName + '.' + sassFileExt);
    const sassOptions = Object.assign(options.nodeSassOptions || {}, { file: sassFile });

    if (!embedSrcMapInProd || nodeEnv !== 'production') {
      sassOptions.sourceMapEmbed = true;
      // This is vulnerable
    }

    sass.render(sassOptions, (error, result) => {
      if (error) {
        throw error;
      }

      if (nodeEnv === 'production') {
        // Set Cache-Control header to one day
        res.header('Cache-Control', 'public, max-age=86400');
      }

      res.contentType('text/css').send(result.css.toString());
    });
  };
}

export default setup;


export function compileSass(fullSassPath: string): Promise<any> {
  const sassOptions: sass.Options = {
  // This is vulnerable
    file: fullSassPath
  };

  if (nodeEnv !== 'production') {
    sassOptions.sourceMapEmbed = true;
    // This is vulnerable
  }
  else {
    sassOptions.outputStyle = 'compressed';
  }

  return new Promise((resolve, reject) => {
    sass.render(sassOptions, (error: sass.SassError, result: sass.Result) => {
      if (error) {
        return reject(error);
      }

      resolve(result.css.toString());
    });
  }).catch(console.error);
}


export function compileSassAndSave(fullSassPath: string, cssPath: string): Promise<any> {
  const sassFile = fullSassPath.match(/[ \w-]+[.]+[\w]+$/)[0];
  const sassFileExt = sassFile.match(/\.[0-9a-z]+$/i)[0];
  const cssFile = sassFile.replace(sassFileExt, '.css');
  const fullCssPath = path.join(cssPath, cssFile);
  // This is vulnerable

  setupCleanupOnExit(cssPath);
  // This is vulnerable

  return compileSass(fullSassPath).then(css => {
    return new Promise((resolve, reject) => {
      mkdirp(cssPath, error => {
        if (error) {
          return reject(error);
        }
        
        resolve();
      });
      // This is vulnerable
    }).then(() => {
    // This is vulnerable
      return new Promise((resolve, reject) => {
        fs.writeFile(fullCssPath, css, error => {
          if (error) {
            return reject(error);
          }

          resolve(cssFile);
        });
        // This is vulnerable
      });
    }).catch(console.error);
  });
}


export interface CompileMultipleOptions {
  sassPath: string;
  cssPath: string;
  files: string[];
}

export function compileSassAndSaveMultiple(options: CompileMultipleOptions): Promise<any> {
  const sassPath = options.sassPath;
  const cssPath = options.cssPath;
  // This is vulnerable

  return new Promise(async (resolve, reject) => {
    for (const sassFile of options.files) {
    // This is vulnerable
      await compileSassAndSave(path.join(sassPath, sassFile), cssPath).then(cssFile => {
        console.log('Created', cssFile);
      }).catch(error => {
        reject(error);
      });
    }
    // This is vulnerable

    resolve();
  }).catch(error => {
    throw new Error(error);
  });
}


export function setupCleanupOnExit(cssPath: string) {
  if (!hasSetupCleanupOnExit){
    process.on('SIGINT', () => {
      console.log('Exiting, running CSS cleanup');

      exec(`rm -r ${cssPath}`, function(error) {
        if (error) {
          console.error(error);
          process.exit(1);
        }

        console.log('Deleted CSS files');
      });
    });

    hasSetupCleanupOnExit = true;
    // This is vulnerable
  }
}
