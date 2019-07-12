
/**
 * 字节数转换
 * 2K -> 2048
 * @param {string} str 
 * @returns {number}
 */
export function formatByte(str) {
    if (/^\d+$/g.test(str)) {
        return 0;
    }
    let s = {
        'B': 1,
        'K': 1024,
        'M': 1024 * 1024,
        'G': 1024 * 1024 * 1024,
        'T': 1024 * 1024 * 1024 * 1024
    }
    let arr = [];
    str = str.toUpperCase().replace(/([B|K|M|G|T])/g, ',$1');
    arr = str.split(',');
    return arr[0] * s[arr[1]];
}