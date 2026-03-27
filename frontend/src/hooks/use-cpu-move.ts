import { useCallback, useState } from 'react';
import type { Board, CharacterId, CpuMoveResponse } from '../types';

export interface UseCpuMoveResult {
  move: CpuMoveResponse['move'] | null;
  commentary: string | null;
  isLoading: boolean;
  error: string | null;
  requestMove: (board: Board, character: CharacterId) => Promise<CpuMoveResponse | null>;
  retry: () => void;
}

interface LastRequest {
  board: Board;
  character: CharacterId;
}

export function useCpuMove(): UseCpuMoveResult {
  const [move, setMove] = useState<CpuMoveResponse['move'] | null>(null);
  const [commentary, setCommentary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRequest, setLastRequest] = useState<LastRequest | null>(null);

  const requestMove = useCallback(
    async (
      board: Board,
      character: CharacterId,
    ): Promise<CpuMoveResponse | null> => {
      setIsLoading(true);
      setError(null);
      setMove(null);
      setCommentary(null);
      setLastRequest({ board, character });

      try {
        const response = await fetch('/api/move', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            board,
            character,
            player_piece: 'X',
            cpu_piece: 'O',
          }),
        });

        if (!response.ok) {
          throw new Error(
            `Backend error: ${response.status} ${response.statusText}`,
          );
        }

        const data: CpuMoveResponse = await response.json();
        setMove(data.move);
        setCommentary(data.commentary);
        setIsLoading(false);
        return data;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(message);
        setIsLoading(false);
        return null;
      }
    },
    [],
  );

  const retry = useCallback(() => {
    if (lastRequest) {
      requestMove(lastRequest.board, lastRequest.character);
    }
  }, [lastRequest, requestMove]);

  return { move, commentary, isLoading, error, requestMove, retry };
}
