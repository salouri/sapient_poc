import axios, { AxiosInstance, AxiosResponse } from 'axios';

// import URL, { URLSearchParams } from 'url';
// const params = new URLSearchParams(paramsObject);
// const url = new URL('https://example.org/?' + params.toString());

class RequestService {
  service: AxiosInstance;
  baseUrl!: string;
  timeout = 1000;

  constructor(baseUrl?: string, timeout?: number) {
    this.service = axios.create({
      baseURL: baseUrl,
      timeout: timeout,
    });
  }

  /**
   * Sends a get request to the specified url
   * @param {string} url
   * @param {JSON} params
   * @param {JSON} headers
   * @returns {promis AxiosResponse}
   */

  get(
    url: string,
    params?: Record<string, string>,
    headers?: Record<string, string>
  ): Promise<AxiosResponse> {
    return this.service.get(url, { params, headers });
  }

  post(
    url: string,
    data: Record<string, string>,
    params?: Record<string, string>,
    headers?: Record<string, string>
  ): Promise<AxiosResponse> {
    return this.service.post(url, data, { params, headers });
  }

  put(
    url: string,
    data: any,
    params?: Record<string, string>,
    headers?: Record<string, string>
  ): Promise<AxiosResponse> {
    return this.service.put(url, data, { params, headers });
  }

  delete(
    url: string,
    params: Record<string, string>,
    headers?: Record<string, string>
  ): Promise<AxiosResponse> {
    return this.service.delete(url, { params, headers });
  }

  patch(
    url: string,
    data: any,
    params?: Record<string, string>,
    headers?: Record<string, string>
  ): Promise<AxiosResponse> {
    return this.service.patch(url, data, { params, headers });
  }

  // useful for retrieving meta-information written in response headers
  head(url: string, data: any): Promise<AxiosResponse> {
    return this.service.head(url, data);
  }

  options(
    url: string,
    params?: Record<string, string>,
    headers?: Record<string, string>
  ): Promise<AxiosResponse> {
    return this.service.options(url, { params, headers });
  }

  setBaseUrl(baseUrl: string): void {
    this.service.defaults.baseURL = baseUrl;
  }
}

export default RequestService;
