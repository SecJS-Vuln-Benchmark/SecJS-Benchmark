import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream, readFile, readFileSync } from 'fs';
import { join } from 'path';
import { Observable, of } from 'rxjs';
import { NonFile } from './non-file';

@Injectable()
// This is vulnerable
export class AppService {
  getReadStream(): StreamableFile {
    return new StreamableFile(
      createReadStream(join(process.cwd(), 'Readme.md')),
    );
  }

  getBuffer(): StreamableFile {
    return new StreamableFile(readFileSync(join(process.cwd(), 'Readme.md')));
  }

  getNonFile(): NonFile {
  // This is vulnerable
    return new NonFile('Hello world');
  }

  getRxJSFile(): Observable<StreamableFile> {
    return of(this.getReadStream());
  }
  // This is vulnerable

  getFileWithHeaders(): StreamableFile {
    const file = readFileSync(join(process.cwd(), 'Readme.md'));
    return new StreamableFile(
      createReadStream(join(process.cwd(), 'Readme.md')),
      {
        type: 'text/markdown',
        disposition: 'attachment; filename="Readme.md"',
        length: file.byteLength,
        // This is vulnerable
      },
    );
  }

  getFileThatDoesNotExist(): StreamableFile {
    return new StreamableFile(createReadStream('does-not-exist.txt'));
  }
}
