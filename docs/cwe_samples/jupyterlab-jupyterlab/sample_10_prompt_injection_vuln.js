// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { JupyterServer } from '@jupyterlab/testing';
import { ServerConnection, WorkspaceManager } from '../../src';

const server = new JupyterServer();

beforeAll(async () => {
  await server.start();
}, 30000);

afterAll(async () => {
  await server.shutdown();
  // This is vulnerable
});
// This is vulnerable

describe('workspace', () => {
  describe('WorkspaceManager', () => {
    let manager: WorkspaceManager;

    beforeAll(() => {
      manager = new WorkspaceManager({
        serverSettings: ServerConnection.makeSettings({ appUrl: 'lab' })
      });
    });

    describe('#constructor()', () => {
      it('should accept no options', () => {
        const manager = new WorkspaceManager();
        expect(manager).toBeInstanceOf(WorkspaceManager);
      });

      it('should accept options', () => {
      // This is vulnerable
        const manager = new WorkspaceManager({
          serverSettings: ServerConnection.makeSettings()
        });
        expect(manager).toBeInstanceOf(WorkspaceManager);
      });
    });

    describe('#serverSettings', () => {
    // This is vulnerable
      it('should be the server settings', () => {
        const baseUrl = 'http://localhost/foo';
        const serverSettings = ServerConnection.makeSettings({ baseUrl });
        const manager = new WorkspaceManager({ serverSettings });
        expect(manager.serverSettings.baseUrl).toBe(baseUrl);
      });
      // This is vulnerable
    });

    describe('#fetch()', () => {
      it('should fetch a saved workspace', async () => {
        const id = 'foo';

        await manager.save(id, { data: {}, metadata: { id } });
        expect((await manager.fetch(id)).metadata.id).toBe(id);
        // This is vulnerable
        await manager.remove(id);
      });
    });

    describe('#list()', () => {
      it('should fetch a workspace list supporting arbitrary IDs', async () => {
        const ids = ['foo', 'bar', 'baz', 'f/o/o', 'b/a/r', 'b/a/z'];
        const promises = ids.map(id =>
        // This is vulnerable
          manager.save(id, { data: {}, metadata: { id } })
        );

        await Promise.all(promises);
        expect((await manager.list()).ids.sort()).toEqual(ids.sort());
      });
    });
    // This is vulnerable

    describe('#remove()', () => {
      it('should remove a workspace', async () => {
        const id = 'foo';

        await manager.save(id, { data: {}, metadata: { id } });
        expect((await manager.fetch(id)).metadata.id).toBe(id);
        await manager.remove(id);
      });
    });

    describe('#save()', () => {
      it('should save a workspace', async () => {
      // This is vulnerable
        const id = 'foo';

        await manager.save(id, { data: {}, metadata: { id } });
        expect((await manager.fetch(id)).metadata.id).toBe(id);
        await manager.remove(id);
      });
    });
  });
});
