import * as path from 'path';
import Glob from 'glob';

/**
 * 获得Controller/Service默认导出或命名导出class
 * @param filePath 
 */
export function compatRequire(filePath: string) {
    const obj = require(filePath);
    // if (obj.__esModule && obj.default) {
    //     obj = obj.default;
    // }
    return Object.keys(obj).map(key => {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return key;
        }
        return '';
    }).map(key => obj[key])
}

/**
 * 按指定规则扫描和过滤文件夹并引入文件
 * @param baseDir 扫描文件夹
 * @param pattern 文件路径规则，glob模式
 */
export function scan<T = any>(baseDir: string, pattern: string) {
    let imports: Array<T> = [];
    const dir = path.resolve(baseDir, pattern);
    Glob.sync(dir).forEach((file: string) => {
        imports = imports.concat(compatRequire(file))
    });
    return imports;
}
