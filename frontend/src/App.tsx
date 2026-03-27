import { useState } from 'react';
import { useGame } from './hooks/use-game';
import { TitleScreen } from './components/title-screen';
import { OpponentSelect } from './components/opponent-select';
import { GameBoard } from './components/game-board';
import { TurnIndicator } from './components/turn-indicator';
import { GameOverOverlay } from './components/game-over-overlay';
import type { CharacterId, GameMode } from './types';

type Screen = 'title' | 'opponent-select' | 'game' | 'game-over';

function App() {
  const game = useGame();
  const [showOpponentSelect, setShowOpponentSelect] = useState(false);

  // Derive current screen from game state
  const currentScreen: Screen = (() => {
    if (showOpponentSelect) return 'opponent-select';
    if (game.gameStatus === 'idle') return 'title';
    if (game.gameStatus === 'won' || game.gameStatus === 'draw')
      return 'game-over';
    return 'game';
  })();

  const handleSelectMode = (mode: GameMode) => {
    if (mode === 'human-vs-human') {
      game.startGame(mode);
    } else {
      setShowOpponentSelect(true);
    }
  };

  const handleSelectOpponent = (characterId: CharacterId) => {
    setShowOpponentSelect(false);
    game.startGame('human-vs-cpu', characterId);
  };

  const handlePlayAgain = () => {
    game.resetGame();
  };

  const handleRematch = () => {
    game.rematch();
  };

  return (
    <>
      {currentScreen === 'title' && (
        <TitleScreen onSelectMode={handleSelectMode} />
      )}

      {currentScreen === 'opponent-select' && (
        <OpponentSelect onSelectOpponent={handleSelectOpponent} />
      )}

      {(currentScreen === 'game' || currentScreen === 'game-over') && (
        <div className="flex flex-col items-center flex-1 pt-[var(--space-12)] px-[var(--space-4)]">
          <TurnIndicator currentTurn={game.currentTurn} />
          <GameBoard
            board={game.board}
            disabled={
              game.gameStatus !== 'playing'
            }
            winningLine={game.winningLine}
            onCellClick={(row, col) => game.placeMove(row, col)}
          />
        </div>
      )}

      <GameOverOverlay
        gameStatus={game.gameStatus}
        winner={game.winner}
        opponent={game.selectedOpponent}
        isHvCpu={game.gameMode === 'human-vs-cpu'}
        onPlayAgain={handlePlayAgain}
        onRematch={handleRematch}
      />
    </>
  );
}

export default App;
