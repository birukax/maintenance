export interface FormData {
    [key: string | number]: any;
}
export interface FetchParams {
    [key: string]: any;
}

export interface FetchOneParams {
    [key: string]: any;
}

export interface UpdateFormData {
    id: number | string | undefined,
    formData: FormData,
}
export interface Data {
    id: number | string | undefined;
    [key: string]: any;
}
export interface PaginatedData<T> {
    results: T;
    next: string | null;
    previous: string | null;
    count: number;
}

export interface DataState<T> {
    data: T,
    loading: boolean;
    error: any;
}