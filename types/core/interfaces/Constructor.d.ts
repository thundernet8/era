import { IEraContext } from '../../context';
import EraApplication from '../../app';
export declare type Constructor<T = any> = {
    new (...args: any[]): T;
};
export interface IController {
    ctx: IEraContext;
    app: EraApplication;
}
export interface IService {
    ctx: IEraContext;
    app: EraApplication;
}
