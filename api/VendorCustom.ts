export type VendorCustom = {
    [name: string]: any
}

export function vendorExtractor(raw: any): VendorCustom{
    let vendorStuff = new Map<string, any>();
    for (const key in raw) {
        if (key[0] == "_") {
            vendorStuff.set(key, raw[key]);
        }
    }
    return vendorStuff;
}