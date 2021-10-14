import Model, { ModelMask } from './Model';

export type MaskedModel<T> = Model<T> | ModelMask<T>; // 屏蔽无需暴露给用户的属性与方法
