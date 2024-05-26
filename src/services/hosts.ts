import axios, { AxiosResponse } from "axios";
import { BASE_URL } from "./config";

export type IHostsResponse = Promise<AxiosResponse<IHosts[]>>;
export interface IHosts {
  host_id: string;
  name: string;
  hostaddr: string;
  credentials: {
    type: string;
    user: string;
    sudo: boolean;
  };
  platform_id: string;
  status: string;
}
export type IPlatformsResponse = Promise<AxiosResponse<IPlatform[]>>;
export interface IPlatform {
  platform_id: string;
  title: string;
  profiles: IProfile[];
}

export interface IProfile {
  id: string;
  title: string;
  description: string;
}

export interface IFormAddHost {
  company_id: string;
  name: string;
  hostaddr: string;
  port: number;
  platform_id: string;
  credentials: {
    type: string;
    user: string;
    sudo: boolean;
  };
  profiles: string[];
  status: string;
}
export type IScanResponse = Promise<AxiosResponse<IScan[]>>;
export type IScanPostValues = {
  platform_id: string;
  profile_id: string;
};

export interface IScan {
  error_message: string;
  platform_id: string;
  timestamp: string;
  status: string;
  scan_id: string;
  host_id: string;
}

export async function asyncGetCompanyHosts(): IHostsResponse {
  return axios.get(`${BASE_URL}/hosts`).catch((errors) => errors);
}

export async function asyncGetPlatforms(): IPlatformsResponse {
  return axios.get(`${BASE_URL}/platforms`).catch((errors) => errors);
}

export async function asyncAddHost(host: IFormAddHost) {
  return axios.post(`${BASE_URL}/hosts`, host).catch((errors) => errors);
}

export async function asyncGetScanById(id = ""): IScanResponse {
  return axios.get(`${BASE_URL}/hosts/${id}/scans`).catch((errors) => errors);
}

export async function asyncPostScanById(id = "", values: IScanPostValues) {
  return axios
    .post(`${BASE_URL}/hosts/${id}/scans`, values)
    .catch((errors) => errors);
}
