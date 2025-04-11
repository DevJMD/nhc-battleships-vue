/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BS_COLUMN_COUNT: number;
    readonly VITE_BS_ROW_COUNT: number;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
