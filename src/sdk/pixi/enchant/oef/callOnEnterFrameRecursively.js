// type ObjectWithOnEnterFrameAndChildren = {
//   onEnterFrame?: () => void;
//   children?: Iterable<ObjectWithOnEnterFrameAndChildren>;
// };
export function callOnEnterFrameRecursively(target) {
    if (target.onEnterFrame) {
        target.onEnterFrame.call(target);
    }
    if (target.children) {
        for (const child of target.children) {
            callOnEnterFrameRecursively(child);
        }
    }
}
//# sourceMappingURL=callOnEnterFrameRecursively.js.map