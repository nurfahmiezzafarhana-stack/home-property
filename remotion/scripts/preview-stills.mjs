// Preview only: renders selected still frames per design (no final MP4).
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const browserExecutable = fs.existsSync('/opt/pw-browsers/chromium_headless_shell') ? '/opt/pw-browsers/chromium_headless_shell' : null;
const ids = process.argv[2] ? process.argv[2].split(',') : ['DesignA-Luxe', 'DesignB-Pop', 'DesignC-Minimal'];
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
// hook build-up, one frame inside every shot, CTA build-up
const frames = [4, 20, 45, 90, 110, 175, 235, 300, 360, 420, 480, 540, 600, 680, 740, 790, 830, 850, 870, 900, 930, 950];
for (const id of ids) {
  const comp = await selectComposition({serveUrl, id, browserExecutable});
  const dir = path.resolve('preview', id);
  fs.mkdirSync(dir, {recursive: true});
  for (const f of frames.filter((x) => x < comp.durationInFrames)) {
    const out = path.join(dir, `f${String(f).padStart(4, '0')}.jpg`);
    await renderStill({composition: comp, serveUrl, output: out, frame: f, imageFormat: 'jpeg', jpegQuality: 85, scale: 0.5, browserExecutable});
  }
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-pattern_type', 'glob', '-i', path.join(dir, 'f*.jpg'),
    '-vf', "scale=270:-1,drawtext=text='%{metadata\\:lavf.image2dec.source_basename}':x=6:y=6:fontsize=18:fontcolor=yellow:box=1:boxcolor=black@0.6,tile=6x4:padding=6:color=white", '-frames:v', '1', path.resolve('preview', `${id}-sheet.jpg`)]);
  console.log('done', id);
}
