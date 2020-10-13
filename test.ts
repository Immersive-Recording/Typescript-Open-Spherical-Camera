import { OpenSphericalCamera } from "./api/api.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";
const opts = parse(Deno.args);
const url = opts?.["_"]?.[0];
if(url === undefined || typeof url == "number"){
    throw new Error("No URL given.")
}
let osc = new OpenSphericalCamera("http://" + url)
await osc.getInfo();
console.log(osc.info);
console.log(await osc.updateState());