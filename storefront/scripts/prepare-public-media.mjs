#!/usr/bin/env node
/**
 * Pre-build Media Sanitizer for Cloud Git Deployments (Vercel / Netlify / Cloudflare Pages)
 * Ensures that if the 2.2 GB ../anil_cloth_house/video/ archive is excluded in Git,
 * any dangling video symlinks in public/media/videos/ are removed prior to `vite build`
 * so Vite's static asset copier never fails with ENOENT, while keeping all real copied
 * hero .mp4 files and all 99 .jpg images intact.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const videosDir = path.resolve(__dirname, '../public/media/videos');

if (fs.existsSync(videosDir)) {
  let removedDangling = 0;
  for (const entry of fs.readdirSync(videosDir)) {
    const fullPath = path.join(videosDir, entry);
    try {
      const lstat = fs.lstatSync(fullPath);
      if (lstat.isSymbolicLink()) {
        // Check if symlink target exists in current environment
        if (!fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          removedDangling++;
        }
      }
    } catch {
      // ignore
    }
  }
  if (removedDangling > 0) {
    console.log(
      `[prepare-public-media] Cleaned ${removedDangling} unbundled video symlinks for cloud build.`
    );
  }
}

