import { cp, rm } from 'node:fs/promises';
await rm('dist', {recursive: true, force: true});
await cp('build', 'dist', {recursive: true});
await cp('admin/dist', 'dist/admin', {recursive: true});
