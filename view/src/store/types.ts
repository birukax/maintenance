export interface FormData {
    [key: string]: any;
}
export interface FetchParams {
    [key: string]: any;
}

export interface FetchOneParams {
    [key: string]: any;
}

export interface UpdateFormData {
    id: number,
    formData: FormData,
}
export interface Data {
    id: number;
    [key: string]: any;
}

export interface DataState<T> {
    data: T,
    loading: boolean;
    error: any;
}