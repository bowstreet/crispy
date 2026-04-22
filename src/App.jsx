import { useState } from 'react';
import './App.css';

function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`square${highlight ? ' highlight' : ''}`}
      onClick={onClick}
    >
      {value}
    </button>
  );
}

function Board({ squares, onClick, winningLine }) {
  const renderSquare = (i) => (
    <Square
      key={i}
      value={squares[i]}
      onClick={() => onClick(i)}
      highlight={winningLine && winningLine.includes(i)}
    />
  );

  return (
    <div className="board">
      {[0, 1, 2].map((row) => (
        <div key={row} className="board-row">
          {[0, 1, 2].map((col) => renderSquare(row * 3 + col))}
        </div>
      ))}
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handleClick(i) {
    if (calculateWinner(currentSquares) || currentSquares[i]) {
      return;
    }
    const nextSquares = currentSquares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const result = calculateWinner(currentSquares);
  const winner = result?.winner;
  const winningLine = result?.line;
  const isDraw = !winner && currentSquares.every(Boolean);

  let status;
  if (winner) {
    status = `Winner: ${winner} 🎉`;
  } else if (isDraw) {
    status = "It's a draw! 🤝";
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  const moves = history.map((_, move) => {
    const description = move > 0 ? `Go to move #${move}` : 'Go to game start';
    return (
      <li key={move}>
        <button
          className={`history-btn${move === currentMove ? ' current' : ''}`}
          onClick={() => jumpTo(move)}
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="game">
      <h1>Tic Tac Toe</h1>
      <div className="game-content">
        <div className="game-board">
          <div className={`status ${winner ? 'winner' : isDraw ? 'draw' : ''}`}>
            {status}
          </div>
          <Board
            squares={currentSquares}
            onClick={handleClick}
            winningLine={winningLine}
          />
          <button className="reset-btn" onClick={resetGame}>
            New Game
          </button>
        </div>
        <div className="game-info">
          <h2>History</h2>
          <ol>{moves}</ol>
        </div>
      </div>
    </div>
  );
}
