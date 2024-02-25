import React, { useState, useEffect } from 'react';
import './SudokuBoard.css';

function SudokuBoard() {
  const [puzzle, setPuzzle] = useState([]);
  const [difficulty, setDifficulty] = useState('easy');
  const [timer, setTimer] = useState(null);
  const [isBlinking, setIsBlinking] = useState(false);


  const generateSudokuPuzzle = (difficulty) => {
    const puzzles = {
      easy: [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
      ],
      medium: [
        [0, 0, 4, 0, 0, 0, 0, 1, 7],
        [3, 0, 0, 0, 0, 0, 5, 0, 0],
        [0, 0, 0, 2, 0, 0, 0, 8, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 8],
        [9, 0, 0, 0, 6, 0, 0, 0, 0],
        [0, 7, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 5, 0, 0, 2],
        [0, 2, 0, 4, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 9, 0, 7, 0],
      ],
      hard: [
        [0, 0, 0, 6, 0, 5, 0, 8, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 8, 0, 0, 0, 0, 0],
        [0, 0, 0, 5, 0, 0, 0, 0, 9],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [8, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 3, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 7, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 2, 0, 0],
      ],
    };

    switch (difficulty) {
      case 'easy':
        return adjustPuzzle(puzzles.easy);
      case 'medium':
        return adjustPuzzle(puzzles.medium);
      case 'hard':
        return adjustPuzzle(puzzles.hard);
      default:
        return adjustPuzzle(puzzles.easy);
    }
  };

  const adjustPuzzle = (puzzle) => {
    // Implement logic to adjust puzzle based on difficulty
    // For now, return the puzzle as is
    return puzzle;
  };

  const startTimer = (minutes) => {
    const endTime = new Date().getTime() + minutes * 60 * 1000;

    const timerInterval = setInterval(() => {
      const currentTime = new Date().getTime();
      const remainingTime = endTime - currentTime;

      if (remainingTime <= 0) {
        clearInterval(timerInterval);
        setTimer(null);
      } else {
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
        setTimer(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);

        // Check if remaining time is less than 5 minutes to start blinking
        setIsBlinking(remainingTime <= 5 * 60 * 1000);
      }
    }, 1000);

    return timerInterval; // Return the interval ID
  };

  useEffect(() => {
    const newPuzzle = generateSudokuPuzzle(difficulty);
    setPuzzle(newPuzzle);

    if (difficulty === 'medium' || difficulty === 'hard') {
      const newTimer = startTimer(difficulty === 'medium' ? 15 : 20);
      setTimer(newTimer);

      return () => clearInterval(newTimer); // Clean up timer on component unmount or difficulty change
    } else {
      setTimer(null); // Clear timer when difficulty is "easy"
    }
  }, [difficulty]);


  const handleCellChange = (event, rowIndex, colIndex) => {
    const newValue = parseInt(event.target.value) || 0;
    const newPuzzle = puzzle.map((row, i) =>
      i === rowIndex ? row.map((cell, j) => (j === colIndex ? newValue : cell)) : row
    );
    setPuzzle(newPuzzle);
  };

  const renderBoard = () => {
    return (
      <div className="SudokuBoard">
        {puzzle.map((row, rowIndex) => (
          <div key={rowIndex} className="SudokuRow">
            {row.map((cell, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} className="SudokuCell">
                <input
                  type="text"
                  maxLength="1"
                  value={cell === 0 ? '' : cell}
                  onChange={(event) => handleCellChange(event, rowIndex, colIndex)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
          <div className="timer">{timer && `Time Left: ${timer}`}</div>
      <div>
        <label htmlFor="difficulty">Select Difficulty:</label>
        <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      {renderBoard()}
    </div>
  );
}

export default SudokuBoard;
