import { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * Thin HTTP client wrapper around Playwright's APIRequestContext.
 * Automatically injects the Authorization header when a token is set.
 */
export class ApiClient {
  private readonly request: APIRequestContext;
  private readonly baseURL: string;
  private token: string | undefined;

  constructor(request: APIRequestContext, baseURL: string) {
    this.request = request;
    this.baseURL = baseURL;
  }

  setToken(token: string): void {
    this.token = token;
  }

  clearToken(): void {
    this.token = undefined;
  }

  hasToken(): boolean {
    return !!this.token;
  }

  private headers(extra?: Record<string, string>): Record<string, string> {
    const h: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...extra,
    };
    if (this.token) {
      h['Authorization'] = `Bearer ${this.token}`;
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

  async delete(path: string): Promise<APIResponse> {
    return this.request.delete(`${this.baseURL}${path}`, {
      headers: this.headers(),
    });
  }

  async patch(path: string, data?: object): Promise<APIResponse> {
    return this.request.patch(`${this.baseURL}${path}`, {
      headers: this.headers(),
      data,
    });
  }

  async put(path: string, data?: object): Promise<APIResponse> {
    return this.request.put(`${this.baseURL}${path}`, {
      headers: this.headers(),
      data,
    });
  }
}
