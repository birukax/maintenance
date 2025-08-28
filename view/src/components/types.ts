export type SelectChangeEvent<T> = {
    target: {
        value: T;
        name?: any;
    }
}