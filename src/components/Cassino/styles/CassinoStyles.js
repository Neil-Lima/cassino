export const containerStyle = {
  fontFamily: 'Arial, sans-serif',
  width: '100vw',
  height: '100vh',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'stretch',
  alignItems: 'stretch',
  padding: 0,
  overflow: 'hidden',
  background:
    'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.20), transparent 35%), radial-gradient(circle, var(--background-light) 0%, var(--background-dark) 100%)',
  perspective: '1000px',
  transformStyle: 'preserve-3d',
};

export const columnStyle = {
  width: '100%',
  height: '100%',
  minHeight: '100vh',
  padding: '18px',
  borderRadius: 0,
  marginBottom: 0,
};

export const titleStyle = {
  color: '#ffd700',
  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  fontSize: '2em',
  textAlign: 'center',
  marginBottom: '20px',
};

export const gameAreaStyle = {
  background:
    'radial-gradient(circle at 25% 20%, rgba(255, 255, 255, 0.20), transparent 40%), linear-gradient(45deg, #b8860b, #daa520)',
  borderRadius: '20px',
  padding: '20px',
  border: '1px solid rgba(255, 215, 0, 0.55)',
  boxShadow:
    'var(--shadow-deep), inset 0 1px 0 rgba(255, 255, 255, 0.22), inset 0 -18px 40px rgba(0,0,0,0.35)',
  position: 'relative',
};

export const slotMachineStyle = {
  display: 'flex',
  justifyContent: 'var(--slot-justify, space-around)',
  alignItems: 'center',
  background: 'linear-gradient(180deg, rgba(0,0,0,0.95), rgba(10,10,10,0.98))',
  padding: 'var(--slot-padding, 22px)',
  borderRadius: '15px',
  marginBottom: 0,
  border: '1px solid rgba(255, 215, 0, 0.35)',
  boxShadow:
    '0 18px 50px rgba(0,0,0,0.55), inset 0 0 30px rgba(255,215,0,0.35), inset 0 1px 0 rgba(255,255,255,0.14)',
  flex: 1,
};

export const reelStyle = {
  width: 'var(--reel-width, 132px)',
  height: 'var(--reel-height, 276px)',
  overflow: 'hidden',
  background: 'linear-gradient(180deg, #ffffff 0%, #f3f3f3 50%, #ffffff 100%)',
  border: '3px solid var(--gold-1)',
  position: 'relative',
  borderRadius: '10px',
  boxShadow:
    '0 18px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,215,0,0.20), inset 0 1px 0 rgba(255,255,255,0.75), inset 0 -18px 25px rgba(0,0,0,0.10)',
};

export const controlsStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '15px',
  marginBottom: '20px',
};

export const inputStyle = {
  padding: '10px',
  fontSize: '16px',
  width: '100px',
  borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.18)',
  background:
    'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.12) 100%)',
  color: '#333',
  boxShadow:
    '0 10px 25px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -10px 18px rgba(0,0,0,0.12)',
};

export const resultStyle = {
  fontSize: '24px',
  marginTop: '20px',
  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  textAlign: 'center',
};

export const balanceStyle = {
  fontSize: '24px',
  marginTop: '20px',
  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  textAlign: 'center',
};

export const leverContainerStyle = {
  position: 'absolute',
  width: '100px',
  height: '300px',
  cursor: 'grab',
  userSelect: 'none',
  touchAction: 'none',
};

export const leverStyle = {
  width: 'var(--lever-rod-width, 18px)',
  height: 'var(--lever-rod-height, 330px)',
  background:
    'linear-gradient(90deg, rgba(10,10,10,0.95) 0%, rgba(70,70,70,0.75) 35%, rgba(0,0,0,0.98) 100%)',
  borderRadius: '10px',
  position: 'absolute',
  top: 'var(--lever-rod-top, 90px)',
  left: '50%',
  marginLeft: 'calc(var(--lever-rod-width, 18px) / -2)',
  transformOrigin: 'center 92%',
  transformStyle: 'preserve-3d',
  transition: 'transform 140ms ease',
  willChange: 'transform',
  zIndex: 2,
  boxShadow:
    '0 18px 28px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -10px 18px rgba(0,0,0,0.45)',
};

export const leverKnobStyle = {
  width: 'var(--lever-knob-size, 74px)',
  height: 'var(--lever-knob-size, 74px)',
  background:
    'radial-gradient(circle at 28% 28%, #ff8a8a 0%, #ff2a2a 35%, #b10000 78%, #6b0000 100%)',
  borderRadius: '50%',
  position: 'absolute',
  top: 'var(--lever-knob-top, -55px)',
  left: '50%',
  marginLeft: 'calc(var(--lever-knob-size, 74px) / -2)',
  transformStyle: 'preserve-3d',
  backfaceVisibility: 'hidden',
  zIndex: 3,
  willChange: 'transform, filter',
  boxShadow:
    '0 24px 35px rgba(0,0,0,0.45), inset 0 2px 0 rgba(255,255,255,0.30), inset 0 -16px 24px rgba(0,0,0,0.35)',
};

export const leverBaseStyle = {
  width: 'var(--lever-base-size, 108px)',
  height: 'var(--lever-base-size, 108px)',
  background:
    'radial-gradient(circle at 28% 28%, rgba(245,245,245,0.95), rgba(175,175,175,0.85) 45%, rgba(60,60,60,0.85) 100%)',
  borderRadius: '50%',
  position: 'absolute',
  bottom: 'var(--lever-base-bottom, 26px)',
  left: '50%',
  marginLeft: 'calc(var(--lever-base-size, 108px) / -2)',
  border: '1px solid rgba(0,0,0,0.25)',
  boxShadow:
    '0 26px 40px rgba(0,0,0,0.42), inset 0 2px 0 rgba(255,255,255,0.45), inset 0 -18px 26px rgba(0,0,0,0.30)',
};

export const themeToggleStyle = {
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

export const fireworksStyle = {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  zIndex: 9999,
};

export const casinoLayoutStyle = {
  display: 'grid',
  gap: '18px',
  alignItems: 'stretch',
  position: 'relative',
};

export const leverZoneStyle = {
  position: 'relative',
  height: '100%',
  minHeight: 'var(--lever-zone-min-height, 560px)',
  borderRadius: '20px',
  border: '1px solid rgba(255,255,255,0.18)',
  perspective: '420px',
  transformStyle: 'preserve-3d',
  background:
    'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.10) 40%, rgba(0,0,0,0.28) 100%)',
  boxShadow:
    '0 30px 70px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -28px 55px rgba(0,0,0,0.28)',
  cursor: 'grab',
  userSelect: 'none',
  touchAction: 'none',
};

export const cabinetStyle = {
  borderRadius: '18px',
  padding: '14px',
  background:
    'linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04)), linear-gradient(135deg, #6f7177 0%, #e6e7ea 25%, #8a8d95 55%, #2f3238 100%)',
  boxShadow:
    '0 34px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.60), inset 0 -28px 45px rgba(0,0,0,0.35)',
  border: '1px solid rgba(255,255,255,0.22)',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 'var(--lever-zone-min-height, 560px)',
};

export const cabinetHudStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  padding: '10px 12px',
  borderRadius: '12px',
  background: 'linear-gradient(180deg, rgba(80,160,255,0.92), rgba(10,60,140,0.95))',
  border: '1px solid rgba(255,255,255,0.25)',
  boxShadow: '0 18px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.32)',
  marginBottom: '12px',
};

export const cabinetFrameStyle = {
  borderRadius: '16px',
  padding: '10px',
  background: 'linear-gradient(180deg, rgba(0,0,0,0.88), rgba(10,10,10,0.98))',
  border: '1px solid rgba(255,215,0,0.32)',
  boxShadow: '0 22px 55px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.10)',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
};

export const cabinetInnerStyle = {
  borderRadius: '12px',
  padding: '8px',
  background:
    'linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02)), radial-gradient(circle at 50% 10%, rgba(255,255,255,0.12), transparent 55%)',
  border: '1px solid rgba(255,255,255,0.08)',
  flex: 1,
  display: 'flex',
};

export const rightPanelStyle = {
  borderRadius: '18px',
  padding: '12px',
  background:
    'linear-gradient(180deg, rgba(240,240,245,0.10) 0%, rgba(0,0,0,0.55) 100%), linear-gradient(135deg, rgba(30,30,45,0.55), rgba(0,0,0,0.25))',
  border: '1px solid rgba(255,255,255,0.12)',
  boxShadow: '0 24px 55px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.18)',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

export const rightPanelBoxStyle = {
  borderRadius: '14px',
  padding: '12px',
  background: 'linear-gradient(180deg, rgba(0,0,0,0.85), rgba(0,0,0,0.98))',
  border: '1px solid rgba(0,255,255,0.25)',
  boxShadow:
    '0 10px 25px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -18px 25px rgba(0,0,0,0.55)',
  color: 'rgba(255,255,255,0.92)',
};

export const bottomButtonsStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '14px',
  marginTop: '10px',
  paddingTop: '8px',
};

export const cabinetButtonStyle = {
  width: '64px',
  height: '20px',
  borderRadius: '999px',
  background:
    'linear-gradient(180deg, rgba(255,120,60,0.95), rgba(160,40,10,0.95))',
  border: '1px solid rgba(255,255,255,0.22)',
  boxShadow: '0 12px 22px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.25)',
};

export const bottomBarStyle = {
  marginTop: '14px',
};
