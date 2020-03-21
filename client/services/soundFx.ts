const cdnUrl = 'https://dloycpjzg76ow.cloudfront.net/sounds';

interface SoundFxFiles {
  [label: string]: string;
}

interface SoundFxBuffers {
  [label: string]: AudioBuffer | null;
}

// interface Sources {
//   [label: string]: ?AudioBufferSourceNode,
// };

let supported = false;
let ctx: AudioContext | undefined;
let dst: AudioDestinationNode | GainNode;
let gainNode: GainNode;
const buffers: SoundFxBuffers = {};
const soundFiles: SoundFxFiles = {
  button1: `${cdnUrl}/Button 1.mp3`,
  button2: `${cdnUrl}/Button 2.mp3`,
  button3: `${cdnUrl}/Button 3.mp3`,
  button4: `${cdnUrl}/Button 4.mp3`,
  button5: `${cdnUrl}/Button 5.mp3`,
  button6: `${cdnUrl}/Button 6.mp3`,
  button7: `${cdnUrl}/Button 7.mp3`,
  collapse: `${cdnUrl}/Collapse.mp3`,
  expand: `${cdnUrl}/Expand.mp3`,
  tab1: `${cdnUrl}/Tab 1.mp3`,
  tab2: `${cdnUrl}/Tab 2.mp3`,
  tab3: `${cdnUrl}/Tab 3.mp3`,
  complete1: `${cdnUrl}/Complete 1.mp3`,
  complete2: `${cdnUrl}/Complete 2.mp3`,
  complete3: `${cdnUrl}/Complete 3.mp3`,
  success1: `${cdnUrl}/Success 1.mp3`,
  success2: `${cdnUrl}/Success 2.mp3`,
  success3: `${cdnUrl}/Success 3.mp3`,
  cancel1: `${cdnUrl}/Cancel 1.mp3`,
  cancel2: `${cdnUrl}/Cancel 2.mp3`,
  error1: `${cdnUrl}/Error 1.mp3`,
  error2: `${cdnUrl}/Error 2.mp3`,
  error3: `${cdnUrl}/Error 3.mp3`,
  error4: `${cdnUrl}/Error 4.mp3`,
  error5: `${cdnUrl}/Error 5.mp3`,
  alert1: `${cdnUrl}/Alert 1.mp3`,
  alert2: `${cdnUrl}/Alert 2.mp3`,
  alert3: `${cdnUrl}/Alert 3.mp3`,
  alert4: `${cdnUrl}/Alert 4.mp3`,
  alert5: `${cdnUrl}/Alert 5.mp3`,
  notification1: `${cdnUrl}/Notification 1.mp3`,
  notification2: `${cdnUrl}/Notification 2.mp3`,
  notification3: `${cdnUrl}/Notification 3.mp3`,
  notification4: `${cdnUrl}/Notification 4.mp3`,
  notification5: `${cdnUrl}/Notification 5.mp3`,
  notification6: `${cdnUrl}/Notification 6.mp3`,
  notification7: `${cdnUrl}/Notification 7.mp3`,
  notification8: `${cdnUrl}/Notification 8.mp3`,
  notification9: `${cdnUrl}/Notification 9.mp3`,
};

if (typeof AudioContext !== 'undefined') {
  ctx = new AudioContext();
  //@ts-ignore
} else if (typeof webkitAudioContext !== 'undefined') {
  //@ts-ignore
  ctx = new webkitAudioContext();

  // Polyfill decodeAudioData
  //@ts-ignore
  const oldFunc = webkitAudioContext.prototype.decodeAudioData;
  //@ts-ignore
  webkitAudioContext.prototype.decodeAudioData = function (arraybuffer) {
    return new Promise((resolve, reject) => {
      oldFunc.call(this, arraybuffer, resolve, reject);
    });
  };
}

if (ctx != null && ctx.createBufferSource !== undefined) {
  supported = true;

  if (ctx.createGain) {
    gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.25, 0);
    gainNode.connect(ctx.destination);
    dst = gainNode;
  } else {
    dst = ctx.destination;
  }
}

export const preload = async (label: string) => {
  if (!supported || soundFiles[label] === undefined || buffers[label] !== undefined || ctx == null) {
    return;
  }

  try {
    const response = await fetch(soundFiles[label]);
    const arrayBuffer = await response.arrayBuffer();
    buffers[label] = await ctx.decodeAudioData(arrayBuffer);
  } catch (err) {
    // Mark as broken
    buffers[label] = null;
  }
};

export const play = (label: string) => {
  if (!supported || buffers[label] == null || ctx == null) {
    return;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffers[label];
  source.connect(dst);
  source.start();
};
