import React, { useState } from 'react';
import './App.css';

const CHOICES = {
  rock: { name: 'グー', emoji: '✊', id: 'rock' },
  paper: { name: 'パー', emoji: '✋', id: 'paper' },
  scissors: { name: 'チョキ', emoji: '✌️', id: 'scissors' }
};

const RESULTS = {
  win: { text: 'あなたの勝ち！', color: '#4CAF50' },
  lose: { text: 'あなたの負け...', color: '#F44336' },
  draw: { text: 'あいこです', color: '#FF9800' }
};

function App() {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [scores, setScores] = useState({ player: 0, computer: 0, draws: 0 });
  const [gameHistory, setGameHistory] = useState([]);

  const getRandomChoice = () => {
    const choices = Object.keys(CHOICES);
    return choices[Math.floor(Math.random() * choices.length)];
  };

  const determineWinner = (player, computer) => {
    if (player === computer) return 'draw';
    
    const winConditions = {
      rock: 'scissors',
      paper: 'rock',
      scissors: 'paper'
    };
    
    return winConditions[player] === computer ? 'win' : 'lose';
  };

  const playGame = (playerChoice) => {
    const computerChoice = getRandomChoice();
    const gameResult = determineWinner(playerChoice, computerChoice);
    
    setPlayerChoice(playerChoice);
    setComputerChoice(computerChoice);
    setResult(gameResult);
    
    // Update scores
    setScores(prev => ({
      ...prev,
      player: gameResult === 'win' ? prev.player + 1 : prev.player,
      computer: gameResult === 'lose' ? prev.computer + 1 : prev.computer,
      draws: gameResult === 'draw' ? prev.draws + 1 : prev.draws
    }));

    // Add to game history
    setGameHistory(prev => [
      ...prev.slice(-9), // Keep only last 10 games
      {
        player: playerChoice,
        computer: computerChoice,
        result: gameResult,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setScores({ player: 0, computer: 0, draws: 0 });
    setGameHistory([]);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎮 じゃんけん対戦 🎮</h1>
        <p>相手を選んでジャンケンしよう！</p>
      </header>

      <main className="game-container">
        <div className="scoreboard">
          <div className="score-item">
            <span className="score-label">あなた</span>
            <span className="score-value">{scores.player}</span>
          </div>
          <div className="score-item">
            <span className="score-label">あいこ</span>
            <span className="score-value">{scores.draws}</span>
          </div>
          <div className="score-item">
            <span className="score-label">コンピュータ</span>
            <span className="score-value">{scores.computer}</span>
          </div>
        </div>

        <div className="game-area">
          <div className="choices-display">
            <div className="choice-container">
              <h3>あなた</h3>
              <div className="choice-display">
                {playerChoice ? (
                  <div className="choice-selected">
                    <span className="choice-emoji">{CHOICES[playerChoice].emoji}</span>
                    <span className="choice-name">{CHOICES[playerChoice].name}</span>
                  </div>
                ) : (
                  <div className="choice-placeholder">?</div>
                )}
              </div>
            </div>

            <div className="vs-section">
              <span className="vs-text">VS</span>
              {result && (
                <div 
                  className="result-display"
                  style={{ color: RESULTS[result].color }}
                >
                  {RESULTS[result].text}
                </div>
              )}
            </div>

            <div className="choice-container">
              <h3>コンピュータ</h3>
              <div className="choice-display">
                {computerChoice ? (
                  <div className="choice-selected">
                    <span className="choice-emoji">{CHOICES[computerChoice].emoji}</span>
                    <span className="choice-name">{CHOICES[computerChoice].name}</span>
                  </div>
                ) : (
                  <div className="choice-placeholder">?</div>
                )}
              </div>
            </div>
          </div>

          <div className="game-controls">
            <h3>手を選んでください：</h3>
            <div className="choice-buttons">
              {Object.entries(CHOICES).map(([key, choice]) => (
                <button
                  key={key}
                  className="choice-button"
                  onClick={() => playGame(key)}
                >
                  <span className="button-emoji">{choice.emoji}</span>
                  <span className="button-text">{choice.name}</span>
                </button>
              ))}
            </div>
            
            <button className="reset-button" onClick={resetGame}>
              ゲームリセット
            </button>
          </div>
        </div>

        {gameHistory.length > 0 && (
          <div className="game-history">
            <h3>最近のゲーム履歴</h3>
            <div className="history-list">
              {gameHistory.slice().reverse().map((game, index) => (
                <div key={index} className="history-item">
                  <span className="history-choices">
                    {CHOICES[game.player].emoji} vs {CHOICES[game.computer].emoji}
                  </span>
                  <span 
                    className="history-result"
                    style={{ color: RESULTS[game.result].color }}
                  >
                    {RESULTS[game.result].text}
                  </span>
                  <span className="history-time">{game.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;