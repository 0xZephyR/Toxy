export interface MaskedModel<T> {
	value: T;
} // 屏蔽无需暴露给用户的属性与方法
export type Component = () => JSX.Element;
