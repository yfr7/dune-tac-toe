import { useGame } from './hooks/use-game';
import { TitleScreen } from './components/title-screen';
import { GameBoard } from './components/game-board';
import { TurnIndicator } from './components/turn-indicator';
import { GameOverOverlay } from './components/game-over-overlay';
import type { GameMode } from './types';

type Screen = 'title' | 'opponent-select' | 'game' | 'game-over';

function App() {
  const game = useGame();

  // Derive current screen from game state
  const currentScreen: Screen = (() => {
    if (game.gameStatus === 'idle') return 'title';
    if (game.gameStatus === 'won' || game.gameStatus === 'draw')
      return 'game-over';
    return 'game';
  })();

  const handleSelectMode = (mode: GameMode) => {
    if (mode === 'human-vs-human') {
      game.startGame(mode);
    }
    // human-vs-cpu will be handled by T017 (opponent selection screen)
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
