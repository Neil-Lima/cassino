import React, { useMemo, useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useCassino } from '../utils/CassinoUtils';
import {
  containerStyle,
  columnStyle,
  gameAreaStyle,
  slotMachineStyle,
  reelStyle,
  controlsStyle,
  inputStyle,
  resultStyle,
  balanceStyle,
  leverStyle,
  leverKnobStyle,
  leverBaseStyle,
  themeToggleStyle,
  fireworksStyle,
  casinoLayoutStyle,
  cabinetStyle,
  cabinetFrameStyle,
  cabinetInnerStyle,
  bottomBarStyle,
  leverZoneStyle,
} from '../styles/CassinoStyles';

const CassinoComp = () => {
  const [activeBottomTab, setActiveBottomTab] = useState('paytable');

  const reelCount = 3;

  const {
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
    computedWinnings,
    resetGame,
    handleLeverStart,
    handleLeverPull,
    handleLeverRelease,
  } = useCassino();

  const historyText = useMemo(() => {
    if (!history || history.length === 0) return 'Sem histórico ainda.';
    return history
      .slice(0, 6)
      .map((entry) => (entry.win ? `Ganhou ${entry.amount}` : `Perdeu ${entry.amount}`))
      .join(' • ');
  }, [history]);

  const clampNumber = (value, min, max, fallback) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return fallback;
    const clamped = Math.min(Math.max(num, min), max);
    return clamped;
  };

  const leverAnim = useMemo(() => {
    const t = Math.min(Math.max(leverRotation / 60, 0), 1);
    return {
      pullY: t * 64,
      pullZ: t * 92,
      tiltX: t * -58,
      shadowY: 8 + leverRotation * 0.25,
      shadowBlur: 18 + leverRotation * 0.55,
      knobScale: 1 + t * 0.10,
      knobShadowY: 10 + t * 10,
      knobShadowBlur: 22 + t * 18,
    };
  }, [leverRotation]);

  return (
    <Container fluid className={isDarkTheme ? 'dark-theme' : 'light-theme'} style={containerStyle}>
      <Button onClick={toggleTheme} style={themeToggleStyle}>
        {isDarkTheme ? '☀️' : '🌙'}
      </Button>

      <div ref={fireworksContainerRef} style={fireworksStyle}></div>

      <Row className="casino-layout">
        <Col xs={12} style={{ margin: 0, padding: 0 }}>
          <div className="panel-3d casino-shell" style={{ ...columnStyle }}>
            <div className="casino-grid" style={casinoLayoutStyle}>
              <div
                className="slot-lever-zone"
                style={leverZoneStyle}
                onPointerDown={(e) => {
                  try {
                    e.currentTarget.setPointerCapture(e.pointerId);
                  } catch (_) {
                    // ignore
                  }
                  handleLeverStart();
                  handleLeverPull(e);
                }}
                onPointerMove={handleLeverPull}
                onPointerUp={handleLeverRelease}
                onPointerCancel={handleLeverRelease}
              >
                <div
                  className="slot-lever"
                  style={{
                    ...leverStyle,
                    transform: `translateY(${leverAnim.pullY}px) translateZ(${leverAnim.pullZ}px) rotateX(${leverAnim.tiltX}deg)`,
                    filter: `drop-shadow(0 ${leverAnim.shadowY}px ${leverAnim.shadowBlur}px rgba(0,0,0,0.55))`,
                  }}
                >
                  <div
                    className="slot-lever-knob"
                    style={{
                      ...leverKnobStyle,
                      transform: `translateZ(${leverAnim.pullZ + 48}px) scale(${leverAnim.knobScale})`,
                      filter: `drop-shadow(0 ${leverAnim.knobShadowY}px ${leverAnim.knobShadowBlur}px rgba(0,0,0,0.55))`,
                    }}
                  ></div>
                </div>
                <div style={leverBaseStyle}></div>
              </div>

              <div className="slot-cabinet" style={{ ...gameAreaStyle, ...cabinetStyle, transform: machineTransform }}>
                <div className="slot-frame" style={cabinetFrameStyle}>
                  <div className="slot-inner" style={cabinetInnerStyle}>
                    <div className="slot-3d" style={slotMachineStyle}>
                      {Array.from({ length: reelCount }, (_, index) => index).map((index) => (
                        <div
                          key={index}
                          ref={(el) => (reelsRef.current[index] = el)}
                          className="reel-3d"
                          style={reelStyle}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={bottomBarStyle}>
              <Form style={controlsStyle}>
                <Form.Group>
                  <Form.Control
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(clampNumber(e.target.value, 1, 1000000, 10))}
                    min="1"
                    placeholder="Aposta"
                    style={inputStyle}
                    disabled={spinning || !!gameOverMessage}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Control
                    type="number"
                    value={lines}
                    onChange={(e) => setLines(clampNumber(e.target.value, 1, 20, 10))}
                    min="1"
                    max="20"
                    placeholder="Linhas"
                    style={inputStyle}
                    disabled={spinning || !!gameOverMessage}
                  />
                </Form.Group>
              </Form>

              <div style={resultStyle}>
                {spinning && <p>Girando...</p>}
                {!!notice && !spinning && <p>{notice}</p>}
                {!notice && results.length > 0 && !spinning && (
                  <p>{computedWinnings > 0 ? `Você ganhou ${computedWinnings}!` : 'Tente novamente!'}</p>
                )}
                {!!gameOverMessage && (
                  <div>
                    <p>{gameOverMessage}</p>
                    <Button variant="warning" onClick={resetGame}>
                      Reiniciar
                    </Button>
                  </div>
                )}
              </div>

              <div style={balanceStyle}>Saldo: ${balance}</div>
            </div>

            <div className="don-bottom">
              <div className="don-tabs">
                <button
                  type="button"
                  className={activeBottomTab === 'paytable' ? 'don-tab active' : 'don-tab'}
                  onClick={() => setActiveBottomTab('paytable')}
                >
                  Pagamentos
                </button>
                <button
                  type="button"
                  className={activeBottomTab === 'history' ? 'don-tab active' : 'don-tab'}
                  onClick={() => setActiveBottomTab('history')}
                >
                  Histórico
                </button>
              </div>

              <div className="don-bottom-panel">
                {activeBottomTab === 'paytable' && (
                  <div>
                    <div className="don-row"><span>🐯🐯🐯🐯🐯</span><span>1000x</span></div>
                    <div className="don-row"><span>💎💎💎💎💎</span><span>500x</span></div>
                    <div className="don-row"><span>🍒🍒🍒🍒🍒</span><span>250x</span></div>
                    <div className="don-row"><span>🍋🍋🍋🍋🍋</span><span>100x</span></div>
                  </div>
                )}

                {activeBottomTab === 'history' && (
                  <div className="don-history">{historyText}</div>
                )}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CassinoComp;
