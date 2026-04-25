import fs from 'fs';
import path from 'path';

/**
 * Vite plugin that reads all code files from a local folder
 * and serves them as a virtual module.
 * 
 * Add new files to the folder → refresh page → they appear in ASMVAULT.
 */
export default function localFilesPlugin(folderPath) {
  const VIRTUAL_ID = 'virtual:local-files';
  const RESOLVED_ID = '\0' + VIRTUAL_ID;

  return {
    name: 'vite-plugin-local-files',

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },

    load(id) {
      if (id !== RESOLVED_ID) return null;

      const absFolder = path.resolve(folderPath);

      if (!fs.existsSync(absFolder)) {
        return `export default [];`;
      }

      const files = [];
      const entries = fs.readdirSync(absFolder, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) continue;

        const filePath = path.join(absFolder, entry.name);
        const content = fs.readFileSync(filePath, 'utf-8');
        const stat = fs.statSync(filePath);
        const ext = path.extname(entry.name).replace('.', '').toUpperCase();
        const nameNoExt = path.basename(entry.name, path.extname(entry.name)).toUpperCase();

        files.push({
          id: Buffer.from(filePath).toString('base64url'),
          filename: nameNoExt,
          extension: ext || 'TXT',
          content: content,
          size_bytes: stat.size,
          uploaded_at: stat.mtime.toISOString(),
          updated_at: stat.mtime.toISOString(),
          source: 'local',
        });
      }

      // Sort alphabetically
      files.sort((a, b) => a.filename.localeCompare(b.filename));

      return `export default ${JSON.stringify(files, null, 2)};`;
    },

    // Watch the folder for changes during dev
    configureServer(server) {
      const absFolder = path.resolve(folderPath);
      if (fs.existsSync(absFolder)) {
        server.watcher.add(absFolder);
        server.watcher.on('all', (event, changedPath) => {
          if (changedPath.startsWith(absFolder)) {
            // Invalidate the virtual module so it re-reads files
            const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
            if (mod) {
              server.moduleGraph.invalidateModule(mod);
              server.ws.send({ type: 'full-reload' });
            }
          }
        });
      }
    },
  };
}
