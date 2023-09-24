export function getConfig(cfg) {
    cfg.name = 'KRC Parser';
    cfg.version = '0.2';
    cfg.author = 'ohyeah & TT';
    cfg.parsePlainText = false;
    cfg.fileType = 'krc';
}

export function parseLyric(context) {
    const zipData = xorKRC(context.lyricData);
    if (!zipData) return;

    const unzipData = zlib.uncompress(zipData.buffer);
    if (unzipData == null) return;

    context.lyricText = krc2lrc(arrayBufferToString(unzipData));
}

function xorKRC(rawData) {
    if (rawData == null) return;

    const dataView = new Uint8Array(rawData);
    const magicBytes = [0x6b, 0x72, 0x63, 0x31]; // 'k' , 'r' , 'c' ,'1'
    if (dataView.length < magicBytes.length) return;

    for (let i = 0; i < magicBytes.length; ++i) {
        if (dataView[i] !== magicBytes[i]) return;
    }

    const decryptedData = new Uint8Array(dataView.length - magicBytes.length);
    const encKey = [0x40, 0x47, 0x61, 0x77, 0x5e, 0x32, 0x74, 0x47, 0x51, 0x36, 0x31, 0x2d, 0xce, 0xd2, 0x6e, 0x69];
    const hdrOffset = magicBytes.length;

    for (let i = hdrOffset; i < dataView.length; ++i) {
        const x = dataView[i];
        const y = encKey[(i - hdrOffset) % encKey.length];
        decryptedData[i - hdrOffset] = x ^ y;
    }

    return decryptedData;
}

// example
// [1000,1200]<0,400,0>word1<400,200,0>word2<600,300,0>word3
// [playback pos, duration]<word offset, word duration, 0>word
function krc2lrc(krcText) {
    let lyricText = '';
    let matches;
    const metaRegex = /^\[(\S+):(\S+)\]$/;
    const timestampsRegex = /^\[(\d+),(\d+)\]/;
    const timestamps2Regex = /<(\d+),(\d+),(\d+)>([^<]*)/g;
    const lines = krcText.split(/[\r\n]/);

    for (const line of lines) {
        if ((matches = metaRegex.exec(line))) { // meta info
            lyricText += `${matches[0]}\r\n`;
        }
        else if ((matches = timestampsRegex.exec(line))) {
            let lyricLine = '';
            const startTime = parseInt(matches[1]);
            const duration = parseInt(matches[2]);
            lyricLine = `[${formatTime(startTime)}]`;

            // parse sub-timestamps
            let subMatches;
            while ((subMatches = timestamps2Regex.exec(line))) {
                const offset = parseInt(subMatches[1]);
                const subWord = subMatches[4];
                lyricLine += `<${formatTime(startTime + offset)}>${subWord}`;
            }

            lyricLine += `<${formatTime(startTime + duration)}>`;
            lyricText += `${lyricLine}\r\n`;
        }
    }

    return lyricText;
}

function formatTime(time) {
	const zpad = (n) => {
		const s = n.toString();
		return (s.length < 2) ? `0${s}` : s;
	};

	let t = Math.abs(time / 1000);
	const h = Math.floor(t / 3600);
	t -= h * 3600;

	const m = Math.floor(t / 60);
	t -= m * 60;

	const s = Math.floor(t);
	const ms = t - s;

	return `${(h ? `${zpad(h)}:` : '') + zpad(m)}:${zpad(s)}.${zpad(Math.floor(ms * 100))}`;
}
