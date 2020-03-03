import * as path from 'path';
import Glob from 'glob';

/**
 * 按指定规则扫描和过滤文件夹并引入文件
 * @param baseDir 扫描文件夹
 * @param pattern 文件路径规则，glob模式
 */
export function scan<T = any>(baseDir: string, pattern: string) {
    const imports: Array<T> = [];
    const dir = path.resolve(baseDir, pattern);
    Glob.sync(dir).forEach((file: string) => {
        let obj = require(file);
        if (obj.__esModule && obj.default) {
            obj = obj.default;
        }
        imports.push(obj);
    });
    return imports;
}
