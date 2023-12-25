export type Header = {
    key: string
    label: string
};

export interface LocalInfo {
    [x: string]: {};
    seq: number
    deptCode: string
    deptName: string
    parentDeptCode: string
    parentDeptName: string
    deptDepth: number
    deptSort: number
}

export interface selectValue {
    depth: number,
    parentCode: string,
}