/**
 * 获得Controller/Service默认导出或命名导出class
 * @param filePath
 */
export declare function compatRequire(filePath: string): any[];
/**
 * 按指定规则扫描和过滤文件夹并引入文件
 * @param baseDir 扫描文件夹
 * @param pattern 文件路径规则，glob模式
 */
export declare function scan<T = any>(baseDir: string, pattern: string): T[];
