import { useEffect, useMemo, useRef, useState } from 'react';
import Fireworks from 'fireworks-js';

const symbols = ['🐯', '💎', '🍒', '🍋'];
const maxWins = 5;
const winProbability = 0.2;
// deve bater com --symbol-height em index.css para não cortar símbolos
const SYMBOL_HEIGHT = 96;

const STOP_SPEEDS_MS = [90, 140, 190, 260, 340];
const STRIP_REPEATS = 6;
const REEL_ELEMENT_COUNT = 6;

export const useCassino = () => {
  const [balance, setBalance] = useState(1000);
  const [spinning, setSpinning] = useState(false);
  const [winCount, setWinCount] = useState(0);
  const [results, setResults] = useState([]);
  const [betAmount, setBetAmount] = useState(10);
  const [lines, setLines] = useState(10);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [history, setHistory] = useState([]);
  const [leverRotation, setLeverRotation] = useState(0);
  const [notice, setNotice] = useState('');
  const [gameOverMessage, setGameOverMessage] = useState('');

  const reelsRef = useRef([]);
  const fireworksContainerRef = useRef(null);
  const balanceRef = useRef(balance);
  const startBalanceRef = useRef(balance);
  const winCountRef = useRef(winCount);
  const spinningRef = useRef(spinning);
  const leverEngagedRef = useRef(false);
  const reelIntervalsRef = useRef([]);
  const reelStripRef = useRef([]);
  const reelNextIndexRef = useRef([]);
  const reelElementsRef = useRef([]);
  const stoppedCountRef = useRef(0);
  const roundCostRef = useRef(0);
  const autoStopTimeoutRef = useRef(null);
  const leverMaxRotationRef = useRef(0);

  const getReelCount = () => reelsRef.current.filter(Boolean).length;

  useEffect(() => {
    balanceRef.current = balance;
  }, [balance]);

  useEffect(() => {
    spinningRef.current = spinning;
  }, [spinning]);

  useEffect(() => {
    winCountRef.current = winCount;
  }, [winCount]);

  useEffect(() => {
    reelsRef.current.forEach((reel) => {
      if (!reel) return;
      reel.querySelectorAll('.symbol').forEach((el) => el.remove());
      for (let i = 0; i < REEL_ELEMENT_COUNT; i++) {
        const symbol = document.createElement('div');
        symbol.classList.add('symbol');
        symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        symbol.style.top = `${i * SYMBOL_HEIGHT}px`;
        symbol.style.transition = 'top 120ms linear, filter 160ms ease, transform 160ms ease, opacity 160ms ease';
        reel.appendChild(symbol);
      }
    });

    const baseStrip = Array(STRIP_REPEATS).fill(symbols).flat();

    reelStripRef.current = reelsRef.current.map(() => baseStrip);
    reelNextIndexRef.current = reelsRef.current.map(() => Math.floor(Math.random() * baseStrip.length));
    reelElementsRef.current = reelsRef.current.map((reel) => {
      if (!reel) return [];
      return Array.from(reel.querySelectorAll('.symbol'));
    });

    reelsRef.current.forEach((reel, reelIndex) => {
      if (!reel) return;
      const strip = reelStripRef.current[reelIndex];
      let nextIdx = reelNextIndexRef.current[reelIndex];
      const els = reelElementsRef.current[reelIndex] || [];
      els.forEach((el, i) => {
        el.textContent = strip[(nextIdx + i) % strip.length];
        el.style.top = `${i * SYMBOL_HEIGHT}px`;
      });
      reelNextIndexRef.current[reelIndex] = (nextIdx + els.length) % strip.length;
      // foco inicial
      setFocusClasses(reelIndex);
    });

    return () => {
      stopAllIntervals();
      if (autoStopTimeoutRef.current) {
        clearTimeout(autoStopTimeoutRef.current);
        autoStopTimeoutRef.current = null;
      }
      reelsRef.current.forEach((reel) => {
        if (!reel) return;
        reel.querySelectorAll('.symbol').forEach((el) => el.remove());
      });
      reelElementsRef.current = [];
    };
  }, []);

  const setFocusClasses = (reelIndex) => {
    const els = reelElementsRef.current[reelIndex] || [];
    const targetTop = 2 * SYMBOL_HEIGHT;
    const positions = els.map((el) => ({ el, top: Number.parseFloat(el.style.top || '0') }));

    let focusEl = null;
    let bestDist = Number.POSITIVE_INFINITY;
    positions.forEach((p) => {
      const dist = Math.abs(p.top - targetTop);
      if (dist < bestDist) {
        bestDist = dist;
        focusEl = p.el;
      }
    });

    positions.forEach((p) => {
      if (p.el === focusEl) {
        p.el.classList.add('focus');
        p.el.classList.remove('blur');
      } else {
        p.el.classList.add('blur');
        p.el.classList.remove('focus');
      }
    });
  };

  const calculateWinnings = (resultsParam, bet, linesCount) => {
    let winnings = 0;
    const middleRow = resultsParam.map((reel) => reel[2]);
    if (new Set(middleRow).size === 1) {
      const symbol = middleRow[0];
      switch (symbol) {
        case '🐯':
          winnings = bet * 1000;
          break;
        case '💎':
          winnings = bet * 500;
          break;
        case '🍒':
          winnings = bet * 250;
          break;
        case '🍋':
          winnings = bet * 100;
          break;
        default:
          winnings = 0;
      }
    }
    return winnings * linesCount;
  };

  const updateHistory = (netWin) => {
    setHistory((prevHistory) => [
      { win: netWin >= 0, amount: Math.abs(netWin) },
      ...prevHistory.slice(0, 4),
    ]);
  };

  const tickReel = (reelIndex, speedMs) => {
    const strip = reelStripRef.current[reelIndex];
    const els = reelElementsRef.current[reelIndex] || [];
    if (!strip || strip.length === 0 || els.length === 0) return;

    const wrapThreshold = (REEL_ELEMENT_COUNT - 1) * SYMBOL_HEIGHT;

    els.forEach((el) => {
      const currentTop = Number.parseFloat(el.style.top || '0');
      const nextTop = currentTop + SYMBOL_HEIGHT;
      el.style.transition = `top ${Math.max(60, speedMs)}ms linear, filter 160ms ease, transform 160ms ease, opacity 160ms ease`;

      if (nextTop > wrapThreshold) {
        // recicla para acima do topo e anima entrada até 0 (evita sobreposição)
        const idx = reelNextIndexRef.current[reelIndex] ?? 0;
        el.textContent = strip[idx % strip.length];
        reelNextIndexRef.current[reelIndex] = (idx + 1) % strip.length;

        el.style.transition = 'none';
        el.style.top = `${-SYMBOL_HEIGHT}px`;
        void el.offsetHeight;
        el.style.transition = `top ${Math.max(60, speedMs)}ms linear, filter 160ms ease, transform 160ms ease, opacity 160ms ease`;
        el.style.top = '0px';
      } else {
        el.style.top = `${nextTop}px`;
      }
    });

    setFocusClasses(reelIndex);
  };

  const startReelInterval = (reelIndex, speedMs) => {
    if (reelIntervalsRef.current[reelIndex]) {
      clearInterval(reelIntervalsRef.current[reelIndex]);
    }
    reelIntervalsRef.current[reelIndex] = setInterval(() => tickReel(reelIndex, speedMs), speedMs);
  };

  const stopReelInterval = (reelIndex) => {
    if (reelIntervalsRef.current[reelIndex]) {
      clearInterval(reelIntervalsRef.current[reelIndex]);
      reelIntervalsRef.current[reelIndex] = null;
    }
  };

  const stopAllIntervals = () => {
    reelIntervalsRef.current.forEach((id) => {
      if (id) clearInterval(id);
    });
    reelIntervalsRef.current = [];
  };

  const getCurrentGrid = () => {
    return reelsRef.current.map((_, reelIndex) => {
      const els = reelElementsRef.current[reelIndex] || [];
      const ordered = els
        .map((el) => ({ top: Number.parseFloat(el.style.top || '0'), value: el.textContent || '' }))
        .sort((a, b) => a.top - b.top);

      // pega os 5 primeiros "slots" visíveis
      return ordered.slice(0, 5).map((x) => x.value);
    });
  };

  const showWinningAnimation = (resultsParam) => {
    const middleRow = resultsParam.map((reel) => reel[2]);
    reelsRef.current.forEach((reel, index) => {
      if (!reel) return;
      const symbol = reel.querySelectorAll('.symbol')[2];
      if (middleRow[index] === middleRow[0]) {
        symbol.classList.add('winning');
      }
    });

    setTimeout(() => {
      reelsRef.current.forEach((reel) => {
        if (!reel) return;
        reel.querySelectorAll('.symbol').forEach((symbol) => {
          symbol.classList.remove('winning');
        });
      });
    }, 2000);
  };

  const showFireworks = () => {
    if (!fireworksContainerRef.current) return;

    const fireworks = new Fireworks(fireworksContainerRef.current, {
      speed: 2,
      acceleration: 1.05,
      friction: 0.97,
      gravity: 1.5,
      particles: 50,
      explosion: 5,
    });

    fireworks.start();
    setTimeout(() => fireworks.stop(), 3000);
  };

  const resetGame = () => {
    stopAllIntervals();
    if (autoStopTimeoutRef.current) {
      clearTimeout(autoStopTimeoutRef.current);
      autoStopTimeoutRef.current = null;
    }
    setBalance(1000);
    setWinCount(0);
    setHistory([]);
    setResults([]);
    setNotice('');
    setGameOverMessage('');
    setLeverRotation(0);
    leverEngagedRef.current = false;
    stoppedCountRef.current = 0;
    roundCostRef.current = 0;
  };

  const endGame = () => {
    setGameOverMessage(
      `Jogo encerrado! Você ganhou ${winCountRef.current} vezes e seu saldo final é ${balanceRef.current}.`
    );
  };

  const finalizeRound = () => {
    const finalGrid = getCurrentGrid();
    setResults(finalGrid);

    if (autoStopTimeoutRef.current) {
      clearTimeout(autoStopTimeoutRef.current);
      autoStopTimeoutRef.current = null;
    }

    const winnings = calculateWinnings(finalGrid, betAmount, lines);
    const totalBet = roundCostRef.current;
    const baseBalance = startBalanceRef.current ?? balanceRef.current;
    const nextBalance = baseBalance - totalBet + winnings;
    const won = winnings > 0;
    const nextWinCount = won ? winCountRef.current + 1 : winCountRef.current;

    setBalance(nextBalance);
    setWinCount(nextWinCount);
    updateHistory(winnings - totalBet);

    if (won) {
      showWinningAnimation(finalGrid);
      showFireworks();
      setNotice(`Você ganhou ${winnings}!`);
    } else {
      setNotice('Tente novamente!');
    }

    setSpinning(false);
    spinningRef.current = false;
    stoppedCountRef.current = 0;
    roundCostRef.current = 0;

    if (nextBalance <= 0 || nextWinCount >= maxWins) {
      setTimeout(() => {
        endGame();
      }, 250);
    }
  };

  const startRound = () => {
    if (spinning) return;
    if (gameOverMessage) return;

    const reelCount = getReelCount();
    if (reelCount <= 0) return;

    const currentBalance = balanceRef.current;
    const totalBet = betAmount * lines;
    if (currentBalance <= 0) {
      endGame();
      return;
    }
    if (totalBet > currentBalance) {
      setNotice('Saldo insuficiente!');
      return;
    }

    startBalanceRef.current = currentBalance;
    roundCostRef.current = totalBet;
    stoppedCountRef.current = 0;
    setNotice('');

    setBalance(currentBalance - totalBet);
    setSpinning(true);
    spinningRef.current = true;

    // força recalcular foco antes de começar
    reelsRef.current.forEach((_, i) => setFocusClasses(i));

    // inicia todos rápido
    for (let i = 0; i < reelCount; i++) startReelInterval(i, STOP_SPEEDS_MS[1]);

    // após 3s, para automaticamente o primeiro rolo (índice 0)
    if (autoStopTimeoutRef.current) {
      clearTimeout(autoStopTimeoutRef.current);
    }
    autoStopTimeoutRef.current = setTimeout(() => {
      if (!spinningRef.current) {
        autoStopTimeoutRef.current = null;
        return;
      }
      if (stoppedCountRef.current === 0) {
        stopReelInterval(0);
        setFocusClasses(0);
        stoppedCountRef.current = 1;
      }
      autoStopTimeoutRef.current = null;
    }, 3000);
  };

  const stopNextReel = () => {
    if (!spinning) return;
    const reelCount = getReelCount();
    const nextIndex = stoppedCountRef.current;
    if (nextIndex >= reelCount) return;

    stopReelInterval(nextIndex);
    setFocusClasses(nextIndex);

    stoppedCountRef.current = nextIndex + 1;

    if (stoppedCountRef.current >= reelCount) {
      stopAllIntervals();
      finalizeRound();
    }
  };

  const toggleTheme = () => {
    setIsDarkTheme((prev) => !prev);
  };

  const handleLeverStart = () => {
    if (gameOverMessage) return;
    leverEngagedRef.current = true;
    leverMaxRotationRef.current = 0;
    setNotice('');
  };

  const handleLeverPull = (e) => {
    if (!leverEngagedRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pullDistance = e.clientY - rect.top;
    const rotation = Math.min(Math.max(pullDistance / 2, 0), 60);
    setLeverRotation(rotation);
    if (rotation > leverMaxRotationRef.current) {
      leverMaxRotationRef.current = rotation;
    }
  };

  const handleLeverRelease = () => {
    if (!leverEngagedRef.current) return;
    leverEngagedRef.current = false;

    const didPull = leverMaxRotationRef.current >= 20;
    leverMaxRotationRef.current = 0;

    setLeverRotation(0);

    if (!didPull) return;

    // 1º puxão inicia rodada; puxões seguintes param 1 rolo por vez
    if (!spinning) startRound();
    else {
      // antes do auto-stop de 3s, não permite parar manualmente
      if (stoppedCountRef.current === 0) return;
      stopNextReel();
    }
  };

  const computedWinnings = useMemo(() => {
    if (!results || results.length === 0) return 0;
    return calculateWinnings(results, betAmount, lines);
  }, [results, betAmount, lines]);

  const totalBet = useMemo(() => betAmount * lines, [betAmount, lines]);

  const machineTransform = useMemo(() => {
    return 'translateZ(25px)';
  }, []);

  return {
    balance,
    spinning,
    results,
    betAmount,
    lines,
    isDarkTheme,
    history,
    leverRotation,
    notice,
    gameOverMessage,
    totalBet,
    machineTransform,
    reelsRef,
    fireworksContainerRef,
    toggleTheme,
    setBetAmount,
    setLines,
    calculateWinnings,
    computedWinnings,
    resetGame,
    handleLeverStart,
    handleLeverPull,
    handleLeverRelease,
  };
};
