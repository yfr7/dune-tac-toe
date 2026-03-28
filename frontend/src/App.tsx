import { useCallback, useEffect, useRef, useState } from 'react';
import { useGame } from './hooks/use-game';
import { useCpuMove } from './hooks/use-cpu-move';
import { useDocumentTitle } from './hooks/use-document-title';
import { TitleScreen } from './components/title-screen';
import { OpponentSelect } from './components/opponent-select';
import { GameBoard } from './components/game-board';
import { TurnIndicator } from './components/turn-indicator';
import { CommentaryBox } from './components/commentary-box';
import { GameOverOverlay } from './components/game-over-overlay';
import { ErrorToast } from './components/error-toast';
import { AttributionFooter } from './components/attribution-footer';
import { getCharacter } from './data/characters';
import type { CharacterId, GameMode } from './types';

type Screen = 'title' | 'opponent-select' | 'game' | 'game-over';

function App() {
  const game = useGame();
  const cpuMove = useCpuMove();
  const [showOpponentSelect, setShowOpponentSelect] = useState(false);
  const [cpuThinking, setCpuThinking] = useState(false);
  const [errorDismissed, setErrorDismissed] = useState(false);
  const processingCpuMove = useRef(false);

  const isHvCpu = game.gameMode === 'human-vs-cpu';

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
    setCpuThinking(false);
    game.resetGame();
  };

  const handleRematch = () => {
    setCpuThinking(false);
    game.rematch();
  };

  // Trigger CPU move when it's O's turn in HvCPU mode
  const triggerCpuMove = useCallback(async () => {
    if (processingCpuMove.current) return;
    if (!game.selectedOpponent) return;

    processingCpuMove.current = true;
    setCpuThinking(true);

    const result = await cpuMove.requestMove(
      game.board,
      game.selectedOpponent,
    );

    if (result) {
      game.placeCpuMove(result.move.row, result.move.col);
    }

    setCpuThinking(false);
    processingCpuMove.current = false;
  }, [game.board, game.selectedOpponent, cpuMove.requestMove, game.placeCpuMove]);

  // Watch for CPU's turn
  useEffect(() => {
    if (
      isHvCpu &&
      game.gameStatus === 'playing' &&
      game.currentTurn === 'O' &&
      !processingCpuMove.current
    ) {
      triggerCpuMove();
    }
  }, [isHvCpu, game.gameStatus, game.currentTurn, triggerCpuMove]);

  // Reset dismissed state when a new error occurs
  useEffect(() => {
    if (cpuMove.error) setErrorDismissed(false);
  }, [cpuMove.error]);

  const showErrorToast = isHvCpu && !!cpuMove.error && !errorDismissed;

  const handleRetry = useCallback(() => {
    setErrorDismissed(false);
    triggerCpuMove();
  }, [triggerCpuMove]);

  const handleDismissError = useCallback(() => {
    setErrorDismissed(true);
  }, []);

  const handleCellClick = (row: number, col: number) => {
    if (isHvCpu && game.currentTurn === 'O') return;
    game.placeMove(row, col);
  };

  const character = game.selectedOpponent
    ? getCharacter(game.selectedOpponent)
    : null;

  useDocumentTitle({
    screen: currentScreen,
    gameStatus: game.gameStatus,
    currentTurn: game.currentTurn,
    winner: game.winner,
    isHvCpu,
    cpuThinking,
    characterName: character?.name ?? null,
  });

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
          <TurnIndicator
            currentTurn={game.currentTurn}
            cpuThinking={cpuThinking}
            characterName={character?.name}
          />
          <GameBoard
            board={game.board}
            disabled={game.gameStatus !== 'playing' || cpuThinking}
            cpuThinking={cpuThinking}
            winningLine={game.winningLine}
            onCellClick={handleCellClick}
          />
          {isHvCpu && character && (
            <CommentaryBox
              characterName={character.name}
              commentary={cpuMove.commentary}
              characterId={character.id}
            />
          )}
        </div>
      )}

      <GameOverOverlay
        gameStatus={game.gameStatus}
        winner={game.winner}
        opponent={game.selectedOpponent}
        isHvCpu={isHvCpu}
        onPlayAgain={handlePlayAgain}
        onRematch={handleRematch}
      />

      {showErrorToast && (
        <ErrorToast
          message={cpuMove.error!}
          onRetry={handleRetry}
          onDismiss={handleDismissError}
        />
      )}

      <AttributionFooter />
    </>
  );
}

export default App;
