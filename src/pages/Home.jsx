import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Fireworks from 'fireworks-js';

const symbols = ['🐯', '💎', '🍒', '🍋', '🍇', '🔔', '💰', '🃏'];
const maxWins = 5;
const winProbability = 0.2;

const CassinoTigrinhoDeluxe3D = () => {
  const [balance, setBalance] = useState(1000);
  const [spinning, setSpinning] = useState(false);
  const [winCount, setWinCount] = useState(0);
  const [results, setResults] = useState([]);
  const [betAmount, setBetAmount] = useState(10);
  const [lines, setLines] = useState(10);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [history, setHistory] = useState([]);
  const [leverRotation, setLeverRotation] = useState(0);

  const reelsRef = useRef([]);
  const fireworksContainerRef = useRef(null);

  useEffect(() => {
    reelsRef.current.forEach((reel) => {
      for (let i = 0; i < 5; i++) {
        const symbol = document.createElement('div');
        symbol.classList.add('symbol');
        symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        symbol.style.top = `${i * 80}px`;
        reel.appendChild(symbol);
      }
    });
  }, []);

  const spin = () => {
    if (spinning || balance <= 0) return;

    const totalBet = betAmount * lines;

    if (totalBet > balance) {
      alert('Saldo insuficiente!');
      return;
    }

    setSpinning(true);
    setBalance((prevBalance) => prevBalance - totalBet);

    const isWinningRound = Math.random() < winProbability && winCount < maxWins;

    const newResults = Array(5).fill().map(() => spinReel(isWinningRound));
    setResults(newResults);

    reelsRef.current.forEach((reel, index) => {
      setTimeout(() => {
        animateReel(reel, newResults[index]);
      }, index * 200);
    });

    setTimeout(() => {
      const winnings = calculateWinnings(newResults, betAmount, lines);
      setBalance((prevBalance) => prevBalance + winnings);
      updateHistory(winnings - totalBet);
      setSpinning(false);

      if (winnings > 0) {
        setWinCount((prevCount) => prevCount + 1);
        showWinningAnimation(newResults);
        showFireworks();
      }

      if (balance <= 0 || winCount >= maxWins) {
        endGame();
      }
    }, 2000);
  };

  const spinReel = (isWinningRound) => {
    if (isWinningRound) {
      const winningSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      return Array(5).fill(winningSymbol);
    }
    return Array(5).fill().map(() => symbols[Math.floor(Math.random() * symbols.length)]);
  };

  const animateReel = (reel, finalSymbols) => {
    const symbolElements = Array.from(reel.querySelectorAll('.symbol'));
    let currentPosition = 0;
    const totalFrames = 30;
    const frameDuration = 1000 / 60;

    function frame() {
      currentPosition++;
      symbolElements.forEach((symbol, index) => {
        const offset = (currentPosition + index) % 5;
        symbol.style.top = `${offset * 80}px`;
        symbol.textContent = finalSymbols[(index - currentPosition + 5) % 5];
        
        if (offset === 2) {
          symbol.classList.add('focus');
          symbol.classList.remove('blur');
        } else {
          symbol.classList.add('blur');
          symbol.classList.remove('focus');
        }
      });

      if (currentPosition < totalFrames) {
        setTimeout(frame, frameDuration);
      } else {
        symbolElements.forEach((symbol, index) => {
          symbol.textContent = finalSymbols[index];
        });
      }
    }

    frame();
  };

  const calculateWinnings = (results, betAmount, lines) => {
    let winnings = 0;
    const middleRow = results.map(reel => reel[2]);
    if (new Set(middleRow).size === 1) {
      const symbol = middleRow[0];
      switch (symbol) {
        case '🐯': winnings = betAmount * 1000; break;
        case '💎': winnings = betAmount * 500; break;
        case '🍒': winnings = betAmount * 250; break;
        case '🍋': winnings = betAmount * 100; break;
        default: winnings = betAmount * 50;
      }
    }
    return winnings * lines;
  };

  const updateHistory = (netWin) => {
    setHistory((prevHistory) => [
      { win: netWin >= 0, amount: Math.abs(netWin) },
      ...prevHistory.slice(0, 4)
    ]);
  };

  const showWinningAnimation = (results) => {
    const middleRow = results.map(reel => reel[2]);
    reelsRef.current.forEach((reel, index) => {
      const symbol = reel.querySelectorAll('.symbol')[2];
      if (middleRow[index] === middleRow[0]) {
        symbol.classList.add('winning');
      }
    });
    setTimeout(() => {
      reelsRef.current.forEach(reel => {
        reel.querySelectorAll('.symbol').forEach(symbol => {
          symbol.classList.remove('winning');
        });
      });
    }, 2000);
  };

  const showFireworks = () => {
    const fireworks = new Fireworks(fireworksContainerRef.current, {
      speed: 2,
      acceleration: 1.05,
      friction: 0.97,
      gravity: 1.5,
      particles: 50,
      explosion: 5
    });
    fireworks.start();
    setTimeout(() => fireworks.stop(), 3000);
  };

  const endGame = () => {
    alert(`Jogo encerrado! Você ganhou ${winCount} vezes e seu saldo final é ${balance}.`);
    resetGame();
  };

  const resetGame = () => {
    setBalance(1000);
    setWinCount(0);
    setHistory([]);
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const handleLeverPull = (e) => {
    const pullDistance = e.clientY - e.target.getBoundingClientRect().top;
    const rotation = Math.min(Math.max(pullDistance / 2, 0), 60);
    setLeverRotation(rotation);
  };

  const handleLeverRelease = () => {
    setLeverRotation(0);
    spin();
  };

  return (
    <Container fluid className={isDarkTheme ? 'dark-theme' : 'light-theme'} style={containerStyle}>
      <Button onClick={toggleTheme} style={themeToggleStyle}>
        {isDarkTheme ? '☀️' : '🌙'}
      </Button>
      <div ref={fireworksContainerRef} style={fireworksStyle}></div>
      <Row>
        <Col md={6}>
          <div style={columnStyle}>
            <h3>Tabela de Pagamentos</h3>
            <p>🐯🐯🐯🐯🐯 = 1000x</p>
            <p>💎💎💎💎💎 = 500x</p>
            <p>🍒🍒🍒🍒🍒 = 250x</p>
            <p>🍋🍋🍋🍋🍋 = 100x</p>
          </div>
          <div style={columnStyle}>
            <h3>Histórico</h3>
            {history.map((entry, index) => (
              <p key={index}>
                {entry.win ? `Ganhou ${entry.amount}` : `Perdeu ${entry.amount}`}
              </p>
            ))}
          </div>
        </Col>
        <Col md={6}>
          <div style={columnStyle}>
            <h1 style={titleStyle}>Cassino Tigrinho Deluxe 3D</h1>
            <div style={gameAreaStyle}>
              <div style={slotMachineStyle}>
                {[0, 1, 2, 3, 4].map((index) => (
                  <div key={index} ref={(el) => (reelsRef.current[index] = el)} style={reelStyle}></div>
                ))}
              </div>
              <Form style={controlsStyle}>
                <Form.Group>
                  <Form.Control
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Number(e.target.value))}
                    min="1"
                    placeholder="Aposta"
                    style={inputStyle}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Control
                    type="number"
                    value={lines}
                    onChange={(e) => setLines(Number(e.target.value))}
                    min="1"
                    max="20"
                    placeholder="Linhas"
                    style={inputStyle}
                  />
                </Form.Group>
              </Form>
              <div style={resultStyle}>
                {results.length > 0 && (
                  <p>
                    {calculateWinnings(results, betAmount, lines) > 0
                      ? `Você ganhou ${calculateWinnings(results, betAmount, lines)}!`
                      : 'Tente novamente!'}
                  </p>
                )}
              </div>
              <div style={balanceStyle}>Saldo: ${balance}</div>
              <div
                style={leverContainerStyle}
                onMouseDown={handleLeverPull}
                onMouseUp={handleLeverRelease}
                onMouseLeave={handleLeverRelease}
              >
                <div style={{ ...leverStyle, transform: `rotate(${leverRotation}deg)` }}>
                  <div style={leverKnobStyle}></div>
                </div>
                <div style={leverBaseStyle}></div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

const containerStyle = {
  fontFamily: 'Arial, sans-serif',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'radial-gradient(circle, var(--background-light) 0%, var(--background-dark) 100%)',
  perspective: '1000px',
};

const columnStyle = {
  padding: '20px',
  background: 'rgba(255,255,255,0.1)',
  borderRadius: '20px',
  boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
  backdropFilter: 'blur(10px)',
  marginBottom: '20px',
};

const titleStyle = {
  color: '#ffd700',
  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  fontSize: '2em',
  textAlign: 'center',
  marginBottom: '20px',
};

const gameAreaStyle = {
  background: 'linear-gradient(45deg, #b8860b, #daa520)',
  borderRadius: '20px',
  padding: '20px',
  boxShadow: '0 0 30px rgba(0,0,0,0.5)',
  position: 'relative',
};

const slotMachineStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  backgroundColor: '#000',
  padding: '15px',
  borderRadius: '15px',
  marginBottom: '20px',
  boxShadow: 'inset 0 0 20px rgba(255,215,0,0.5)',
};

const reelStyle = {
  width: '80px',
  height: '240px',
  overflow: 'hidden',
  backgroundColor: '#fff',
  border: '3px solid #ffd700',
  position: 'relative',
  borderRadius: '10px',
  boxShadow: '0 0 15px rgba(255,215,0,0.7)',
};

const controlsStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '15px',
  marginBottom: '20px',
};

const inputStyle = {
  padding: '10px',
  fontSize: '16px',
  width: '100px',
  borderRadius: '10px',
  border: 'none',
  background: 'rgba(255,255,255,0.2)',
  color: '#333',
  boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
};

const resultStyle = {
  fontSize: '24px',
  marginTop: '20px',
  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  textAlign: 'center',
};

const balanceStyle = {
  fontSize: '24px',
  marginTop: '20px',
  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  textAlign: 'center',
};

const leverContainerStyle = {
  position: 'absolute',
  right: '-100px',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '100px',
  height: '300px',
  cursor: 'grab',
};

const leverStyle = {
  width: '30px',
  height: '220px',
  background: 'linear-gradient(90deg, #ff4500, #ff6347)',
  borderRadius: '15px 15px 8px 8px',
  position: 'absolute',
  top: '0',
  left: '35px',
  transformOrigin: 'center bottom',
  transition: 'transform 0.3s',
  boxShadow: '-5px 0 15px rgba(0,0,0,0.5)',
};

const leverKnobStyle = {
  width: '60px',
  height: '60px',
  background: 'radial-gradient(circle at 30% 30%, #ffd700, #daa520)',
  borderRadius: '50%',
  position: 'absolute',
  top: '-30px',
  left: '-15px',
  boxShadow: '0 0 20px rgba(255,215,0,0.7)',
};

const leverBaseStyle = {
  width: '80px',
  height: '80px',
  background: 'radial-gradient(circle at 30% 30%, #c0c0c0, #a0a0a0)',
  borderRadius: '50%',
  position: 'absolute',
  bottom: '0',
  left: '10px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
};

const themeToggleStyle = {
  position: 'fixed',
  top: '20px',
  right: '20px',
  fontSize: '30px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  zIndex: 1000,
  transition: 'transform 0.3s ease',
};

const fireworksStyle = {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  zIndex: 9999,
};

export default CassinoTigrinhoDeluxe3D;
