import {Config} from '@remotion/cli/config';
Config.setEntryPoint('src/index.ts');
Config.setVideoImageFormat('jpeg');
// Uses the pre-installed headless shell in this cloud container; remove on your own machine.
if (require('fs').existsSync('/opt/pw-browsers/chromium_headless_shell')) {
  Config.setBrowserExecutable('/opt/pw-browsers/chromium_headless_shell');
}
