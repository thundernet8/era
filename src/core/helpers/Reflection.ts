export class Reflection {
    public static getType(type: any, key?: string) {
        return (Reflect as any).getMetadata('design:type', type, key);
    }

    public static getParams(type: any, key?: string): any[] {
        return (Reflect as any).getMetadata('design:paramtypes', type, key);
    }
}
