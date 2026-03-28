import { useEffect } from 'react';
import type { GameStatus, Piece } from '../types';

type Screen = 'title' | 'opponent-select' | 'game' | 'game-over';

interface UseDocumentTitleOptions {
  screen: Screen;
  gameStatus: GameStatus;
  currentTurn: Piece;
  winner: Piece | null;
  isHvCpu: boolean;
  cpuThinking: boolean;
  characterName: string | null;
}

function getTitle(options: UseDocumentTitleOptions): string {
  const { screen, gameStatus, currentTurn, winner, isHvCpu, cpuThinking, characterName } = options;

  switch (screen) {
    case 'title':
      return 'Dune Tac Toe';

    case 'opponent-select':
      return 'Choose Your Opponent \u2014 Dune Tac Toe';

    case 'game': {
      if (isHvCpu && cpuThinking && characterName) {
        return `${characterName} is thinking... \u2014 Dune Tac Toe`;
      }
      if (isHvCpu && currentTurn === 'X') {
        return 'Your Turn \u2014 Dune Tac Toe';
      }
      if (!isHvCpu) {
        return `Player ${currentTurn}'s Turn \u2014 Dune Tac Toe`;
      }
      return 'Dune Tac Toe';
    }

    case 'game-over': {
      if (gameStatus === 'draw') {
        return 'Draw \u2014 Dune Tac Toe';
      }
      if (isHvCpu) {
        return winner === 'X'
          ? 'Victory! \u2014 Dune Tac Toe'
          : 'Defeat \u2014 Dune Tac Toe';
      }
      return `Player ${winner} Wins! \u2014 Dune Tac Toe`;
    }
  }
}

export function useDocumentTitle(options: UseDocumentTitleOptions): void {
  const title = getTitle(options);

  useEffect(() => {
    document.title = title;
  }, [title]);
}

// Export for testing
export { getTitle };
export type { UseDocumentTitleOptions };
