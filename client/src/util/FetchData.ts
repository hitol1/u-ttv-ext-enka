import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { JsonObject } from "config_file.js";
import twitchApi from "../twitchApi";

export async function fetchJSON(userId: string): Promise<AxiosResponse> {
    let token = '';
    let ebsHeaders : any = {};
    twitchApi.client?.onAuthorized(auth => {
        token = auth.token;
        ebsHeaders = getEBSHeaders(auth);
    })
    const headers: JsonObject = ebsHeaders;
    // Defunct, need to fill in when updating the service later.
    let url = 'https://'
    if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'){
        url = 'http://localhost:8080/users/';
    }
    const options: AxiosRequestConfig = { headers } as AxiosRequestConfig;
    url = url + userId;
    const res: AxiosResponse = await (async () => {
        try {
            return await axios.get(url, options);
        } catch (e : any) {
            if (typeof e === "object" && e && "response" in e) return e.response as AxiosResponse;
            else throw e;
        }
    })();

    if (res.data) {
        try {
            res.data = JSON.parse(res.data);
        } catch (e) {
            // do not parse if it is not json due to some error
        }
    }

    return res;
}

const getEBSHeaders = (authorized : Twitch.ext.Authorized): { [header: string]: string } => {
	if (authorized === null) {
		throw new Error(
			"Cannot generate headers for EBS without Twitch authorization",
		);
	}
	return {
		Authorization: `Bearer ${authorized.token}`,
		"X-Twitch-Client-Id": authorized.clientId,
		// TODO: Introduce "X-Twitch-Extension-Version": APPLICATION_VERSION,
		"X-Twitch-User-Id": authorized.channelId,
	};
};