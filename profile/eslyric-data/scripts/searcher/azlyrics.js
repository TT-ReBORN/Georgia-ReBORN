
import { parse } from 'himalaya/src/index.js'

let lyricContainerElements = [];

export function getConfig(cfg) {
    cfg.name = "AZLyrics";
    cfg.version = "0.1";
    cfg.author = "ohyeah";
    cfg.useRawMeta = false;
}

export function getLyrics(meta, man) {

    let artist = procSearchKeyword(meta.artist);
    let title = procSearchKeyword(meta.title);
    if (artist == '' || title == '') return;
    let url = 'https://azlyrics.com/lyrics/' + artist + '/' + title + '.html';
    console.log(url);
    request(url, (err, res, body) => {
        if (err || res.statusCode !== 200) return;
        let jsonBody = parse(body);
        let htmlElement = {};
        for (const element of jsonBody) {
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
        if (findLyricContainerElement(htmlElement, bodyElement)) {
            let findTarget = false;
            let children = lyricContainerElements[0]['children'] || [];
            for (const child of children) {
                let tagName = child['tagName'] || '';
                if (!findTarget) {
                    if (tagName == '__AZL_TARGET_TAG__') findTarget = true;
                    continue;
                }
    
                let type = child['type'] || '';
                if (type != 'element' && tagName != 'div') {
                    continue;
                }
    
                let hasClass = false;
                let attributes = child['attributes'] || [];
                for (const attri of attributes) {
                    let key = attri['key'] || '';
                    if (key == 'class') {
                        hasClass = true;
                        break;
                    }
                }
    
                if (hasClass) continue;
    
                if (lyricText.length > 0) break;
    
                lyricText = parseLyricContainerElement(child, lyricText);
            }
        }

        if (lyricText.length > 0) {
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
    text = text.replace(/[^a-z0-9]/g, '');
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
    if (tagName == 'script' || tagName == 'b') return lyricText;
    if (type == 'text') {
        let content = element['content'] || '';
        if (content == '\r\n' && lyricText.length == 0) return lyricText;
        return lyricText + unicodeDecode(element['content'] || '');
    }

    let children = element['children'] || [];
    for (const child of children) {
        lyricText = parseLyricContainerElement(child, lyricText);
    }

    return lyricText;
}

function findLyricContainerElement(parentElement, element) {
    let type = element['type'] || '';
    if (type != 'element') return false;
    let attributes = element['attributes'] || [];
    let children = element['children'] || [];
    if (children.length == 0) return false;
    for (const attri of attributes) {
        let key = attri['key'] || '';
        let value = attri['value'] || '';
        if (key == 'class' && value.startsWith('lyricsh')) {
            element['tagName'] = '__AZL_TARGET_TAG__';
            lyricContainerElements.push(parentElement);
            return true;
        }
    }

    // find from children
    for (const child of children) {
        if (findLyricContainerElement(element, child)) return true;
    }

    return false;
}