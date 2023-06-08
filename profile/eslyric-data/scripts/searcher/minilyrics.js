
/**
 * https://github.com/entronad/crypto-es
 * https://github.com/olee/minilyrics-proxy/blob/master/minilyricsApi.ts
 */

import crypto from 'crypto-es/lib/index.js';

export function getConfig(cfg) {
    cfg.name = "MiniLyrics";
    cfg.version = "0.1";
    cfg.author = "ohyeah";
    cfg.useRawMeta = false;
}


export function getLyrics(meta, man) {
    let writer = new CompressedXmlWriter();
    writer.addST('filetype', 'lyrics');
    writer.addST('artist', meta.artist);
    writer.addST('title', meta.title);
    writer.addST('client', 'MiniLyrics 7.6.41 for Foobar2000');
    writer.addST('ProtoVer', '0.9');
    writer.addST('OnlyMatched', '1');
    writer.addST('ClientCharEncoding', 'utf-8');
    let xmlData = writer.write();

    let settings = {
        url: 'http://search.crintsoft.com/searchlyrics.htm',
        method: 'POST',
        headers: {
            'User-Agent': 'MiniLyrics 7.6.41 for Foobar2000',
        },
        raw: true,
        body: encryptBuffer(xmlData)
    }

    let lyricResults = [];
    request(settings, (err, res, body) => {
        if (err || res.statusCode != 200) {
            return;
        }

        let cxmlReader = new CompressedXmlReader(decryptBuffer(Uint8Array.from(body)).buffer);
        let results = cxmlReader.read();
        if (results === null) return;
        let server_url = results['server_url'] || '';
        if (server_url === '') return;
        let children = results['children'] || [];
        if (children.length === 0) return;
        for (const child of children) {
            let _type = child['_type'] || '';
            let link = child['link'] || '';
            let artist = child['artist'] || '';
            let title = child['title'] || '';
            let album = child['album'] || '';
            let url = server_url + link;
            lyricResults.push({_type: _type, url: url, artist: artist, title: title, album: album});
        }
    });

    let lyricMeta = man.createLyric();
    for (const entry of lyricResults) {
        settings = {
            url: entry.url,
            method: 'GET',
            headers: {
                'User-Agent': 'MiniLyrics 7.6.41 for Foobar2000',
            }
        }
        
        request(settings, (err, res, body) => {
            if (err || res.statusCode != 200) {
                return;
            }

            lyricMeta.title = entry.title;
            lyricMeta.artist = entry.artist;
            lyricMeta.album = entry.album;
            lyricMeta.lyricText = body;
            man.addLyric(lyricMeta);
        });
    }
}

function encryptBuffer(data) {
    const appendArray = new Uint8Array(stringToArrayBuffer('Mlv1clt4.0'));
    const queryTypedBytes = new Uint8Array(data);
    const queryBytes = new Int8Array(data);
    const arrayToHash = concatTypedArray(Uint8Array, queryTypedBytes, appendArray);
    const md5Bytes = wordToU8Array(crypto.MD5(crypto.lib.WordArray.create(arrayToHash)));
    const byteSum = queryBytes.reduce((v, x) => v + x, 0);
    const key = Math.floor(byteSum / queryBytes.byteLength) & 255;

    for (let i = 0; i < queryBytes.length; i++) {
        queryBytes[i] = key ^ queryBytes[i];
    }

    let rcData = [
        0x02,
        key,
        0x04,
        0x00,
        0x00,
        0x00,
        ...md5Bytes,
        ...queryBytes,
    ];

    //console.log(buf2hex(rcData));

    return rcData;
}

function decryptBuffer(byteBuffer) {
    const k = byteBuffer[1] & 255;
    const valueBuffer = byteBuffer.slice(22, byteBuffer.length);
    for (let i = 0; i < valueBuffer.length; i++) {
        valueBuffer[i] = (valueBuffer[i] ^ k) & 255;
    }
    return valueBuffer;
}

function wordToU8Array(wordArray) {
    let words = wordArray.words;
    let sigBytes = wordArray.sigBytes;
    let u8 = new Uint8Array(sigBytes);
    for (let i = 0; i < sigBytes; i++) {
        let byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
        u8[i] = byte;
    }
    return u8;
}

// https://exploringjs.com/es6/ch_typed-arrays.html#sec_typed-arrays
function concatTypedArray(resultConstructor, ...arrays) {
    let totalLength = 0;
    for (const arr of arrays) {
        totalLength += arr.length;
    }
    const result = new resultConstructor(totalLength);
    let offset = 0;
    for (const arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }
    //console.log(buf2hex(result));
    return result;
}

function buf2hex(buffer) { // buffer is an ArrayBuffer
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join(',');
}

class CompressedXmlWriter {

    constructor() {
        this.stringTable = new Map();
    }

    write() {
        this.writeBody();
        this.writeTail();
        this.writeHeader();
        return Uint8Array.from([...new Uint8Array(this.cxmlHeader), ...new Uint8Array(this.cxmlBody), ...new Uint8Array(this.cxmlTail)]).buffer;
    }

    writeHeader() {
        this.cxmlHeader = new ArrayBuffer(14);
        let headerView = new Uint8Array(this.cxmlHeader);
        headerView.set(Uint8Array.of(0x4d, 0x42, 0x58, 0x4d, 0x4c, 0x31)); // hdr: 'MBXML1' - 5 bytes
        headerView = new DataView(this.cxmlHeader);
        headerView.setUint32(6, 0x02, true);
        headerView.setUint32(10, 6 + 4 + 4 + this.cxmlBody.byteLength + this.cxmlTail.byteLength, true);
        //headerView = new Uint8Array(this.cxmlHeader);
        //console.log(buf2hex(headerView));
    }

    writeBody() {
        let stSize = this.getSTSize();
        this.cxmlBody = new ArrayBuffer(2 + 4 + 4 + 9 + stSize + 2);
        let bodyView = new DataView(this.cxmlBody);
        let _this = this;
        // header guard - 2 bytes
        bodyView.setUint8(0, 0x53);
        bodyView.setUint8(1, 0x54);

        let position = 2 + 4 + 4;
        let appendStringCharCode = function (stringToAppend) {
            let u8 = new Uint8Array(stringToArrayBuffer(stringToAppend));
            new Uint8Array(_this.cxmlBody).set(u8, position);
            position += u8.byteLength;
            bodyView.setUint8(position, 0);
            position += 1;
        };

        // 4 bytes
        bodyView.setUint32(2, this.cxmlBody.byteLength - 2, true);
        // 4 bytes
        bodyView.setUint32(6, 2 * this.stringTable.size + 1, true);
        // 9 bytes
        appendStringCharCode('searchV1');
        // string table
        for (const [k, v] of this.stringTable) {
            appendStringCharCode(k);
            appendStringCharCode(v);
        }

        // tail guard - 2 bytes
        bodyView.setUint8(this.cxmlBody.byteLength - 2, 0x43);
        bodyView.setUint8(this.cxmlBody.byteLength - 1, 0x54);

        //bodyView = new Uint8Array(this.cxmlBody);
        //console.log(buf2hex(bodyView));
    }

    writeTail() {
        this.cxmlTail = new ArrayBuffer(4 + 1 + 2 * this.stringTable.size + 1 + 1);
        let tailView = new DataView(this.cxmlTail);
        tailView.setUint32(0, 2 * this.stringTable.size + 1 + 1 + 1, true);
        tailView.setUint8(4, 0x02);
        tailView.setUint8(5, 0x0a);
        let position = 6;
        for (const [k, v] of this.stringTable) {
            tailView.setUint8(position, 0x0a + position - 5);
            position += 1;
            tailView.setUint8(position, 0x0a + position - 5);
            position += 1;
        }
        tailView.setUint8(position, 0x04);

        //tailView = new Uint8Array(this.cxmlTail);
        //console.log(buf2hex(tailView));
    }

    addST(key, value) {
        this.stringTable.set(key, value);
    }

    getSTSize() {
        let stSize = 0;
        for (const [k, v] of this.stringTable) {
            stSize += k.length + 1;
            stSize += stringToArrayBuffer(v).byteLength + 1;
        }

        return stSize;
    }

}

class CompressedXmlReader {

    position = 0;
    stringTable = [];

    constructor(buffer) {
        this.buffer = new DataView(buffer);
    }

    peekByte() {
        return this.buffer.getUint8(this.position);
    }

    readByte() {
        const v = this.peekByte();
        this.position++;
        return v;
    }

    expectByte(x) {
        const v = this.readByte();
        if (v !== x) {
            throw new Error(`Expected (${x}), but got (${v})`);
        }
        return v;
    }

    readChar() {
        return String.fromCharCode(this.readByte());
    }

    readInt() {
        const v = this.buffer.getUint32(this.position, true);
        this.position += 4;
        return v;
    }

    readSlice(byteCount) {
        if (byteCount === undefined) byteCount = this.buffer.length - this.position + 1;
        const v = new Uint8Array(this.buffer.buffer).slice(this.position, this.position + byteCount);
        this.position += byteCount;
        return v.buffer;
    }

    popValue() {
        return this.stringTable[this.readByte() - 10];;
    }

    readHeader() {
        if (this.readChar() !== 'M' ||
            this.readChar() !== 'B' ||
            this.readChar() !== 'X' ||
            this.readChar() !== 'M' ||
            this.readChar() !== 'L' ||
            this.readChar() !== '1') {
            throw new Error('MBXML header missmatch');
        }
        if (this.readInt() !== 2)
            throw new Error('Header version mismatch');
        // end of stream is encoded here, but it counts starting from the header (MBXML1)
        const fileEnd = this.readInt() - 6 - 4 - 4 - 2;
    }

    readStringTable() {
        if (this.readChar() !== 'S' || this.readChar() !== 'T') {
            throw new Error('String table header missmatch');
        }

        // size of string table in bytes 
        // (including both int32 values at the beginning)
        const stSize = this.readInt() - 8;

        // Number of strings in the string table
        const stCount = this.readInt();

        // console.log('fileEnd =', fileEnd, fileEnd.toString(16));
        // console.log('stSize =', stSize, stSize.toString(16));
        // console.log('stCount =', stCount);
        // Convert utf-8 bytes in string table to string

        const stringTableStr = arrayBufferToString(this.readSlice(stSize));

        // Split by 0-byte
        this.stringTable = stringTableStr.split('\x00');
        this.stringTable.pop();

        if (this.stringTable.length !== stCount) {
            console.warn(`String table should contain ${stCount} items, but has ${this.stringTable.length}`);
        }
    }

    readElement() {
        this.expectByte(2);
        const node = { _type: this.popValue(), };
        // Parse attributes
        while (this.peekByte() >= 10) {
            const key = this.stringTable[this.readByte() - 10];
            const value = this.stringTable[this.readByte() - 10];
            node[key] = value;
        }
        // Parse children if present
        if (this.peekByte() === 3) {
            this.position++;
            node.children = [];
            // loop until no next child found
            while (this.peekByte() !== 4) {
                node.children.push(this.readElement());
            }
        }
        this.expectByte(4);
        return node;
    }

    read() {
        this.readHeader();

        // String table (ST) start
        this.readStringTable();

        // Number of xml entries
        const nodeCount = this.readInt();
        return this.readElement();
    }
}

