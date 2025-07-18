const API_BASE = 'http://localhost:3001/api';

export interface Content {
  id: number;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
}

export const api = {
  getContent: async (): Promise<Content[]> => {
    const response = await fetch(`${API_BASE}/content`);
    return response.json();
  }
};