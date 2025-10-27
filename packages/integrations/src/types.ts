export interface Integration {
  id: string;
  name: string;
  connect(credentials: any): Promise<{ success: boolean }>;
  disconnect(): Promise<{ success: boolean }>;
  sync(data: any): Promise<{ success: boolean }>;
}
