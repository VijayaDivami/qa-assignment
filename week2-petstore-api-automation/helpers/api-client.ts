import { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * Thin HTTP client wrapper around Playwright's APIRequestContext.
 * Injects the api_key header for Petstore authorised endpoints.
 */
export class ApiClient {
  private readonly request: APIRequestContext;
  private readonly baseURL: string;
  private apiKey: string | undefined;

  constructor(request: APIRequestContext, baseURL: string, apiKey?: string) {
    this.request = request;
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  setApiKey(key: string): void {
    this.apiKey = key;
  }

  private headers(extra?: Record<string, string>): Record<string, string> {
    const h: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...extra,
    };
    if (this.apiKey) {
      h['api_key'] = this.apiKey;
    }
    return h;
  }

  async post(path: string, data?: object): Promise<APIResponse> {
    return this.request.post(`${this.baseURL}${path}`, {
      headers: this.headers(),
      data,
    });
  }

  async get(
    path: string,
    params?: Record<string, string | number | boolean>,
  ): Promise<APIResponse> {
    return this.request.get(`${this.baseURL}${path}`, {
      headers: this.headers(),
      params: params as Record<string, string>,
    });
  }

  async put(path: string, data?: object): Promise<APIResponse> {
    return this.request.put(`${this.baseURL}${path}`, {
      headers: this.headers(),
      data,
    });
  }

  async delete(path: string): Promise<APIResponse> {
    return this.request.delete(`${this.baseURL}${path}`, {
      headers: this.headers(),
    });
  }
}
