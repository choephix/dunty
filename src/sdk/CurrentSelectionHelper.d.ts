export declare class CurrentSelectionHelper<T> {
    private readonly callbacks;
    current: T | null;
    constructor(callbacks: {
        onSelect: (item: T) => void;
        onDeselect: (item: T) => void;
    });
    setCurrent(item: T | null): void;
}
