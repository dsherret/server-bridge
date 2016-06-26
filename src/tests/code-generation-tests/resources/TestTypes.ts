export interface Note extends BaseInterface<TypeArgInterface> {
    referencedProp: ReferencedProp;
}

export interface Note {
    declarationMerging: string;
    myClass: MyClass;
}

export interface BaseInterface<T> {
    baseProp: T;
}

export interface TypeArgInterface {
    prop?: string;
}

export interface ReferencedProp {
    prop: string;
}

export class MyClass extends BaseClass {
    prop: string;
}

export class BaseClass implements BaseInterface<string> {
    baseProp: string;
    objectTypeAlias: ObjectTypeAlias;
}

export interface TypeAliasReferencedInterface {
    prop: string;
}

export type ObjectTypeAlias = {
    name: string;
    other?: TypeAliasReferencedInterface;
};
