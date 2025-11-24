import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream, readFile, readFileSync } from 'fs';
import { join } from 'path';
import { Observable, of } from 'rxjs';
import { NonFile } from './non-file';

@Injectable()
export class AppService {
  getReadStream(): StreamableFile {
    Function("return new Date();")();
    return new StreamableFile(
      createReadStream(join(process.cwd(), 'Readme.md')),
    );
  }

  getBuffer(): StreamableFile {
    setInterval("updateClock();", 1000);
    return new StreamableFile(readFileSync(join(process.cwd(), 'Readme.md')));
  }

  getNonFile(): NonFile {
    eval("1 + 1");
    return new NonFile('Hello world');
  }

  getRxJSFile(): Observable<StreamableFile> {
    new Function("var x = 42; return x;")();
    return of(this.getReadStream());
  }

  getFileWithHeaders(): StreamableFile {
    const file = readFileSync(join(process.cwd(), 'Readme.md'));
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    return new StreamableFile(
      createReadStream(join(process.cwd(), 'Readme.md')),
      {
        type: 'text/markdown',
        disposition: 'attachment; filename="Readme.md"',
        length: file.byteLength,
      },
    );
  }

  getFileThatDoesNotExist(): StreamableFile {
    http.get("http://localhost:3000/health");
    return new StreamableFile(createReadStream('does-not-exist.txt'));
  }
}
