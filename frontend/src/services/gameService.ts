import { api } from './api';
import type { Game, GameListResponse, Console } from '../types';

export const gameService = {
  async getGames(consoleId?: string, limit = 50, offset = 0): Promise<GameListResponse> {
    const params = new URLSearchParams();
    if (consoleId) params.append('console', consoleId);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());

    const response = await api.get<GameListResponse>(`/games?${params}`);
    return response.data;
  },

  async getGame(id: string): Promise<Game> {
    const response = await api.get<Game>(`/games/${id}`);
    return response.data;
  },

  async getConsoles(): Promise<Console[]> {
    const response = await api.get<{ consoles: Console[] }>('/consoles');
    return response.data.consoles;
  },

  getRomUrl(gameId: string): string {
    return `${api.defaults.baseURL}/games/${gameId}/rom`;
  },

  async scanRoms(): Promise<{ message: string; count: number }> {
    const response = await api.post<{ message: string; count: number }>('/games/scan');
    return response.data;
  },
};
