import type { VendorCustom } from "./VendorCustom.ts";

export interface CameraInfo {
    manufacturer: string,
    model: string,
    serialNumber: string,
    firmwareVersion: string,
    supportUrl: string,
    gps: boolean,
    gyro: boolean,
    uptime: number,
    api: Array<string>,
    endpoints: Object,
    apiLevel: Array<number>,
    cameraId: string | null,
    vendor: VendorCustom,
}

export interface APIEndpoints {
    httpPort: number,
    httpUpdatesPort: number,
    httpsPort: number,
    httpsUpdatesPort: number,
}