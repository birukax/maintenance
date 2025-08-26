export interface SelectChangeEvent<T> = {
    target: {
        value: T;
        name ?: string;
    }
}