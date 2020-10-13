import type { VendorCustom } from "./VendorCustom.ts";

export interface CameraStateWrapper {
    fingerprint: string,
    state: CameraState
}

export interface CameraState {
    sessionId: string | null,
    batteryLevel: number,
    storageChanged: boolean | null,
    storageUri: string | null,
    vendor: VendorCustom,
}

