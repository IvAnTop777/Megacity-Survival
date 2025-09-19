import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CHARACTERS } from '../Character/characters';
import CharacterView from '../Character/CharacterView';

// Вверху файла (рядом с BASE_RESOURCES)
const VIEWS = ['Profile', 'City', 'Raid', 'World', 'Tasks'];
const BASE_RESOURCES = { light: 0, energy: 0, crystals: 100, city_phase: 0 };

const CHAR_MAP = CHARACTERS.reduce((acc, c) => {
  acc[c.id] = {
    avatar: c.avatar,
    name: c.name,
    level: c.level ?? 1,
    strength: c.strength ?? 0,
    intelligence: c.intelligence ?? 0,
    reaction: c.reaction ?? 0,
    rage: c.rage ?? 0,
  };
  return acc;
}, {});

export default function CharacterDashboard() {
  const { t } = useTranslation();
  const [view, setView] = useState('home');
  const [profiles, setProfiles] = useState([]);   // список персонажей
  const [current, setCurrent] = useState(0);      // индекс текущего
  const [showFirstRunModal, setShowFirstRunModal] = useState(!localStorage.getItem('character'));

  const hydrateFromCharacter = useCallback((key) => {
    if (key && CHAR_MAP[key]) {
      const profile = { ...CHAR_MAP[key] };
      setProfiles([profile]);   // кладём в массив
      setCurrent(0);
      setData({
        profile,
        resources: { ...BASE_RESOURCES },
      });
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    const keys = Object.keys(CHAR_MAP);
    const saved = localStorage.getItem('character');
    if (saved && CHAR_MAP[saved]) {
      hydrateFromCharacter(saved);
    } else if (keys.length) {
      hydrateFromCharacter(keys[0]);
    }
  }, [hydrateFromCharacter]);
  
  const handleSwitchCharacter = (dir = 'next') => {
    if (!profiles.length) return;
    setCurrent((prev) => {
      const next =
        dir === 'prev'
          ? (prev - 1 + profiles.length) % profiles.length
          : (prev + 1) % profiles.length;
      return next;
    });
  };
  
  // ... дальше твой return  
    // Если есть персонажи — выбираем первого по умолчанию
    if (keys.length > 0) {
      const first = keys[0];
      localStorage.setItem('character', first);
      hydrateFromCharacter(first);
      setShowFirstRunModal(false);
      return;
    }
  
    // Если персонажей нет (защита от пустого списка)
    setShowFirstRunModal(true);
  }, [hydrateFromCharacter]);
  
  const handlePickFirstRun = (key) => {
    localStorage.setItem('character', key);
    hydrateFromCharacter(key);
    setShowFirstRunModal(false);
  };

  const handleUpgrade = () => {
    setData((prev) =>
      prev
        ? {
            ...prev,
            profile: {
              ...prev.profile,
              level: (prev.profile.level ?? 1) + 1,
              strength: Math.min((prev.profile.strength ?? 0) + 5, 100),
              intelligence: Math.min((prev.profile.intelligence ?? 0) + 5, 100),
              reaction: Math.min((prev.profile.reaction ?? 0) + 5, 100),
              rage: Math.min((prev.profile.rage ?? 0) + 5, 100),
            },
          }
        : prev
    );
  };

  if (!data && !showFirstRunModal) {
    return (
      <div style={styles.page}>
        <div style={{ marginTop: 100 }}>Loading… ⏳</div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Модалка первого запуска — выбор персонажа */}
      {showFirstRunModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={{ marginTop: 0 }}>{t('select_character') || 'Select Your Character'}</h3>
            <div style={styles.avatarGrid}>
              {Object.entries(CHAR_MAP).map(([key, char]) => (
                <button key={key} style={styles.pickCard} onClick={() => handlePickFirstRun(key)}>
                  <img src={char.avatar} alt={char.name} style={styles.avatarOption} />
                  <div style={styles.pickName}>{char.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

{/* Верхняя панель: язык + Connect Wallet */}
<div style={styles.topbar}>
  <select
    style={styles.select}
    value={i18n.resolvedLanguage || i18n.language || 'en'}
    onChange={(e) => i18n.changeLanguage(e.target.value)}
  >
    <option value="en">EN</option>
    <option value="ru">RU</option>
    <option value="vi">VI</option>
    <option value="zh">ZH</option>
  </select>
  <button style={styles.button}>{t('connect_wallet') || 'Connect Wallet'}</button>
</div>

{/* Лого MEGACITY + Humanode */}
<div style={styles.logo}>
  <h1 style={styles.logoText}>{t('megacity') || 'MEGACITY'}</h1>
  <img
    src={`${process.env.PUBLIC_URL || ''}/logo_humanode.png`}
    alt="Humanode"
    height={28}
  />
</div>
{/* Only for humans + ALPHA */}
<div style={styles.humanLine}>
  <span>{t('only_for_humans') || 'Only for humans'}</span>
  <span
    style={{
      background: '#2f2b1f',
      color: '#eaeffc',
      padding: '2px 8px',
      border: '1px solid #eaeffc',
      fontSize: '12px',
      fontWeight: 'bold',
      fontFamily: 'monospace',
      marginLeft: '12px',
      borderRadius: 6
    }}
  >
    {t('alpha') || 'ALPHA'}
  </span>
</div>

      {/* Секция персонажа */}
      {data && (
        <section style={styles.section}>
          <div style={styles.card}>
          <CharacterView
          character={profiles[current]}
          onChange={handleSwitchCharacter}   // ← рабочий хэндлер
          onUpgrade={handleUpgrade}
          />
          </div>
          {/* Подпись как на скрине (плейсхолдер) */}
          <div style={styles.noteText}>{t('character_placeholder') || 'Здесь будет информация о персонаже'}</div>
        </section>
      )}

      {/* Секция ресурсов */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>{t('resources_view') || 'Resources View'}</div>
        <div style={styles.card}>
          {/* Плейсхолдер как на скрине */}
          <div style={styles.noteText}>{t('resources_placeholder') || 'Здесь будут ресурсы'}</div>
        </div>
      </section>

      {/* Нижняя навигация */}
      <div style={styles.bottomNav}>
        {VIEWS.map((v, idx) => (
          <button
            key={v}
            style={{
              ...styles.navButton(view === v),
              borderRight: idx === VIEWS.length - 1 ? 'none' : '1px solid #333',
            }}
            onClick={() => setView(v)}
          >
            {(t(v.toLowerCase()) || v).toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#000',
    color: '#ececec',
    fontFamily: 'Orbitron, sans-serif',
    paddingBottom: 64,
  },

  topbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 520,
    margin: '16px auto 8px',
    width: '100%',
  },

  select: {
    background: '#111',
    color: '#ececec',
    border: '1px solid #2a2a2a',
    borderRadius: 6,
    padding: '8px 10px',
    cursor: 'pointer',
  },

  button: {
    background: '#111',
    color: '#ececec',
    border: '1px solid #2a2a2a',
    borderRadius: 6,
    padding: '8px 12px',
    cursor: 'pointer',
  },

  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    maxWidth: 520,
    margin: '0 auto 8px',
    width: '100%',
    justifyContent: 'center',
  },

  logoText: {
    margin: 0,
    letterSpacing: '0.08em',
    fontSize: 20,
  },

  humanLine: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    color: '#aab0b6',
    margin: '0 auto 16px',
    maxWidth: 520,
  },

  section: {
    maxWidth: 520,
    margin: '12px auto',
    width: '100%',
  },

  card: {
    background: '#0b0b0b',
    border: '1px solid #1e1e1e',
    borderRadius: 10,
    padding: 12,
  },

  noteText: {
    marginTop: 8,
    color: '#aab0b6',
    fontSize: 12,
  },

  bottomNav: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    background: '#0b0b0b',
    borderTop: '1px solid #1e1e1e',
    display: 'flex',
  },

  navButton: (active) => ({
    flex: 1,
    padding: '12px 0',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: active ? '#00ffcc' : '#9aa0a6',
  }),
};
