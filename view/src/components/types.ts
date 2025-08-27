import React from "react";

export type SelectChangeEvent<T> = {
    target: {
        value: T;
        name?: any;
    }
}