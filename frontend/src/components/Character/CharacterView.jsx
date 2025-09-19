import React from 'react';

const StatBar = ({ label, value, color }) => (
  <div style={styles.statRow}>
    <span style={styles.statLabel}>{label}</span>
    <div style={styles.barContainer}>
      <div style={{ ...styles.barFill, width: `${value}%`, backgroundColor: color }} />
    </div>
    <span style={styles.statValue}>{value}</span>
  </div>
);

const CharacterView = ({ character, onChange, onUpgrade }) => {
  const { name, level, avatar, strength, intelligence, reaction, rage } = character;

  return (
    <div style={styles.container}>
      <div style={styles.leftCol}>
        <div style={styles.avatarBox}>
          <img src={avatar} alt={name} style={styles.avatar} />
        </div>
        <div style={styles.buttons}>
          <button style={styles.button} onClick={onChange}>🔄</button>
          <button style={styles.button} onClick={onUpgrade}>⚡</button>
        </div>
      </div>

      <div style={styles.rightCol}>
        <h2 style={styles.name}>{name} (Lv. {level})</h2>
        <StatBar label="Сила" value={strength} color="#ff4444" />
        <StatBar label="Интеллект" value={intelligence} color="#4488ff" />
        <StatBar label="Реакция" value={reaction} color="#44ff44" />
        <StatBar label="Ярость" value={rage} color="#ff8800" />
      </div>
    </div>
  );
};

export default CharacterView;

const styles = {
  container: { display: 'flex', alignItems: 'flex-start', gap: 20, color: '#fff' },
  leftCol: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  avatarBox: { width: 180, height: 260, border: '2px solid #0ff', borderRadius: 8, overflow: 'hidden', marginBottom: 12 },
  avatar: { width: '100%', height: '100%', objectFit: 'cover' },
  buttons: { display: 'flex', gap: 10 },
  button: { fontSize: 20, padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', background: '#222', color: '#0ff' },
  rightCol: { flex: 1, display: 'flex', flexDirection: 'column', gap: 12 },
  name: { margin: '0 0 10px', fontSize: 22, fontWeight: 'bold' },
  statRow: { display: 'flex', alignItems: 'center', gap: 10 },
  statLabel: { width: 100, textAlign: 'right' },
  barContainer: { flex: 1, height: 16, backgroundColor: '#333', borderRadius: 8, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 8, transition: 'width 0.3s ease' },
  statValue: { width: 40, textAlign: 'left' },
};