declare module 'diff-match-patch' {
  export class diff_match_patch {
    diff_main(a: string, b: string, checklines?: boolean): Array<[number, string]>;
    diff_cleanupSemantic(diffs: Array<[number, string]>): void;
    diff_compute_(a: string, b: string, checklines?: boolean): Array<Array<[number, string]>>;
  }
}
