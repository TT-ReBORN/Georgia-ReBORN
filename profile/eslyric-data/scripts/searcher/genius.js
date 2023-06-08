
/**
 * 
 */

import { parse } from 'himalaya/src/index.js'

let lyricContainerElements = [];

export function getConfig(cfg)
{
    cfg.name = "Genius";
    cfg.version = "0.1";
    cfg.author = "ohyeah";
    cfg.useRawMeta = false;
}

export function getLyrics(meta, man)
{
    let artist = procSearchKeyword(meta.artist);
    let title = procSearchKeyword(meta.title);
    if (artist == '' || title == '') return;
    let url = 'https://genius.com/' + artist + '-' + title + '-lyrics';
    let settings = {
        url: url,
        timeout: 5000
    };
    request(settings, (err, res, body) => 
    {
        if (err || res.statusCode !== 200) return;
        const jsonElement = parse(body)
        let htmlElement = {};
        for (const element of jsonElement) {
            let type = element['type'] || '';
            if (type != 'element') continue;
            let tagName = element['tagName'] || '';
            if (tagName != 'html') continue;
            htmlElement = element;
            break;
        }
    
        let children = htmlElement['children'] || [];
        let bodyElement = {};
        for (const element of children) {
            let type = element['type'] || '';
            if (type != 'element') continue;
            let tagName = element['tagName'] || '';
            if (tagName != 'body') continue;
            bodyElement = element;
            break;
        }
    
        let lyricText = '';
        if (findLyricContainerElement(bodyElement)) {
            for (const element of lyricContainerElements) {
                lyricText = parseLyricContainerElement(element, lyricText);
            }
        }
    
        if (lyricText != '') {
            let lyricMeta = man.createLyric();
            lyricMeta.title = meta.title;
            lyricMeta.artist = meta.artist;
            lyricMeta.lyricText = lyricText;
            lyricMeta.location = url;
            man.addLyric(lyricMeta);
        }
    });
}

function procSearchKeyword(text) {
    text = text.replaceAll(/\(.*\)/g, '');
    text = text.replaceAll(/{.*}/g, '');
    text = text.replaceAll(/\[.*\]/g, '');
    text = text.replaceAll(/【.*】/g, '');
    text = text.normalize().trim().toLowerCase();
    text = text.replace(/[^a-z0-9\- &@]/g, '');
    text = text.replaceAll(' ', '-').replaceAll('&', 'and').replaceAll('@','at');
    return text;
}

// https://stackoverflow.com/a/72959145
const unicodeDecode = (text) => {
    const decoded = text.replace(/&#x([0-9a-f]+);/gi, (_, code) =>
        String.fromCharCode(parseInt(code, 16))
    );

    return decoded;
};

function parseLyricContainerElement(element, lyricText) {
    let type = element['type'] || '';
    let tagName = element['tagName'] || '';
    if (type == 'text') {
        return lyricText + unicodeDecode(element['content'] || '');
    }
    else if (tagName == 'br') {
        return lyricText += '\r\n';
    }

    let children = element['children'] || [];
    for (const child of children) {
        lyricText = parseLyricContainerElement(child, lyricText);
    }

    return lyricText;
}

function findLyricContainerElement(rootElement) {
    let type = rootElement['type'] || '';
    if (type != 'element') return false;
    let attributes = rootElement['attributes'] || [];
    let children = rootElement['children'] || [];
    if (children.length == 0) return false;
    for (const attri of attributes) {
        let key = attri['key'] || '';
        let value = attri['value'] || '';
        if (key == 'data-lyrics-container' && value == 'true') {
            lyricContainerElements.push(rootElement);
            return true;
        }
        if (key == 'class' && value.startsWith('Lyrics__Container')) {
            lyricContainerElements.push(rootElement);
            return true;
        }
    }

    let rc = false;
    // find from children
    for (const child of children) {
        if (findLyricContainerElement(child)) {
            rc = true;
        }
    }

    return rc;
}