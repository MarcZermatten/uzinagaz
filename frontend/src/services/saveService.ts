import { api } from './api';
import type { SaveStateListResponse } from '../types';

export const saveService = {
  async getUserSaves(gameId: string): Promise<SaveStateListResponse> {
    const response = await api.get<SaveStateListResponse>('/saves', {
      params: { game_id: gameId },
    });
    return response.data;
  },

  async uploadSaveState(
    gameId: string,
    slot: number,
    saveData: Blob,
    screenshot?: Blob,
    description?: string
  ): Promise<void> {
    const formData = new FormData();
    formData.append('game_id', gameId);
    formData.append('slot', slot.toString());
    formData.append('save_data', saveData);
    if (screenshot) {
      formData.append('screenshot', screenshot);
    }
    if (description) {
      formData.append('description', description);
    }

    await api.post('/saves/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async downloadSaveState(saveId: string): Promise<Blob> {
    const response = await api.get(`/saves/${saveId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  async deleteSaveState(saveId: string): Promise<void> {
    await api.delete(`/saves/${saveId}`);
  },
};
