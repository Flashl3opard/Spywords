type Tone = { f: number; d: number };

function playTones(tones: Tone[]) {
  if (typeof window === "undefined") return;
  const AudioContextRef = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextRef) return;

  const ctx = new AudioContextRef();
  let time = ctx.currentTime;

  tones.forEach((tone) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "triangle";
    osc.frequency.value = tone.f;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.07, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + tone.d);

    osc.start(time);
    osc.stop(time + tone.d);
    time += tone.d + 0.02;
  });
}

export const sfx = {
  click: () => playTones([{ f: 520, d: 0.08 }]),
  reveal: () => playTones([{ f: 400, d: 0.07 }, { f: 620, d: 0.09 }]),
  turn: () => playTones([{ f: 300, d: 0.08 }, { f: 250, d: 0.08 }]),
  win: () => playTones([{ f: 440, d: 0.1 }, { f: 554, d: 0.1 }, { f: 659, d: 0.12 }]),
};
