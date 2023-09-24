import * as decoder from 'parser_ext.so';

export function getConfig(cfg) {
    cfg.name = 'QRC Parser';
    cfg.version = '0.3';
    cfg.author = 'wistaria & TT';
    cfg.parsePlainText = false;
    cfg.fileType = 'qrc';
}

export function parseLyric(context) {
    const zipData = decoder.decodeQrc(context.lyricData);
    if (zipData == null) return;

    const unzipData = zlib.uncompress(zipData);
    if (unzipData == null) return;

    const lyricText = qrcToLrc(arrayBufferToString(unzipData));
    if (lyricText == null) return;

    context.lyricText = lyricText;
}

function escapeXml(xmlText) {
    return xmlText.replace(/&/g, '&amp;');
}

function qrcToLrc(xmlText) {
    if (xmlText != null && typeof xmlText === 'string' && xmlText.indexOf('<?xml') === -1) {
        return xmlText;
    }

    let xmlRoot = mxml.loadString(xmlText);
    if (xmlRoot == null) {
        xmlText = escapeXml(xmlText);
        xmlRoot = mxml.loadString(xmlText);
    }
    if (xmlRoot == null) {
        console.log(`parse xml failed: ${xmlText}`);
        return;
    }

    const lyricElement = xmlRoot.findElement('Lyric_1', mxml.MXML_DESCEND);
    if (lyricElement == null) return null;

    const lyricType = lyricElement.getAttr('LyricType');
    if (lyricType == null) return null;

    if (parseInt(lyricType) !== 1) return null; // unsupported type??? not sure

    const qrcText = lyricElement.getAttr('LyricContent');
    if (qrcText == null) return null;

    return qrcText
        .replace(/^\[(\d+),(\d+)\]/gm, (_, base, __) => `[${formatTime(+base)}]<${formatTime(+base)}>`)
        .replace(/\((\d+),(\d+)\)/g, (_, start, offset) => `<${formatTime(+start + +offset)}>`);
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
