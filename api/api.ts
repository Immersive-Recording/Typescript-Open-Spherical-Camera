import { vendorExtractor } from "./VendorCustom.ts";
import type { CameraInfo, APIEndpoints } from "./CameraInfo.ts";
import type { CameraStateWrapper, CameraState } from "./CameraState.ts";

export class OpenSphericalCamera{
    private readonly URL: string;
    private _info?: CameraInfo;
    public lastState?: CameraStateWrapper;

    constructor(URL: string){
        this.URL = URL;
    }

    private async request(Path: string, Params?: Map<string, any>) {
        let resp = await fetch(`${this.URL}${Path}`);
        return resp;
    }

    async getInfo(): Promise<CameraInfo> {
        let rawInfo = await this.request("/osc/info").then(resp => resp.json());

        let endpoints: APIEndpoints = {
            httpPort: rawInfo?.endpoints?.httpPort || 80,
            httpUpdatesPort: rawInfo?.endpoints?.httpUpdatesPort || 80,
            httpsPort: rawInfo?.endpoints?.httpsPort || 443,
            httpsUpdatesPort: rawInfo?.endpoints?.httpsUpdatesPort || 443,
        }
        
        this._info = {
            manufacturer: rawInfo.manufacturer,
            model: rawInfo.model,
            serialNumber: rawInfo.serialNumber,
            firmwareVersion: rawInfo.firmwareVersion,
            supportUrl: rawInfo.supportUrl,
            gps: rawInfo.gps,
            gyro: rawInfo.gyro,
            uptime: rawInfo.uptime,
            api: rawInfo.api,
            endpoints: endpoints,
            apiLevel: rawInfo.apiLevel || [1],
            cameraId: rawInfo.cameraId || undefined,
            vendor: vendorExtractor(rawInfo)
        };

        return this._info;
    }

    async updateState(): Promise<CameraStateWrapper> {
        if(!this.info.api.includes("/osc/state")){
            throw new Error("The camera doesn't implement states?");
        }
        let rawState = await this.request("/osc/state").then(resp => resp.json());

        let sessionId: string | null = null;
        let storageChanged: boolean | null = null;
        let storageUri: string | null = null;

        if(this.info.apiLevel.includes(1)){
            sessionId = rawState.state.sessionId;
            storageChanged = rawState.state.storageChanged;
        }
        if (this.info.apiLevel.includes(2)) {
            storageUri = rawState.state.storageUri;
        }


        let state:CameraState = {
            sessionId: sessionId,
            batteryLevel: rawState.state.batteryLevel,
            storageChanged: storageChanged,
            storageUri: storageUri,
            vendor: vendorExtractor(rawState),
        }

        let wrapper: CameraStateWrapper = {
            fingerprint: rawState.fingerprint,
            state: state
        }

        this.lastState = wrapper;
        
        return wrapper;
    }

    public get info(): CameraInfo {
        if(this._info === undefined){
            throw new Error("Never got camera info.");
        }
        return this._info;
    }
}

