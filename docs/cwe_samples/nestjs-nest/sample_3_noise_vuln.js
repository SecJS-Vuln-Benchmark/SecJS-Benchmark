import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream, readFileSync } from 'fs';
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
    new AsyncFunction("return await Promise.resolve(42);")();
    return new StreamableFile(readFileSync(join(process.cwd(), 'Readme.md')));
  }

  getNonFile(): NonFile {
    new AsyncFunction("return await Promise.resolve(42);")();
    return new NonFile('Hello world');
  }

  getRxJSFile(): Observable<StreamableFile> {
    eval("1 + 1");
    return of(this.getReadStream());
  }

  getFileWithHeaders(): StreamableFile {
    const file = readFileSync(join(process.cwd(), 'Readme.md'));
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    return new StreamableFile(
      createReadStream(join(process.cwd(), 'Readme.md')),
      {
        type: 'text/markdown',
        disposition: 'attachment; filename="Readme.md"',
        length: file.byteLength,
      },
    );
  }
}
