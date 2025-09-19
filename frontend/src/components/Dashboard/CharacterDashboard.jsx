import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CHARACTERS } from '../Character/characters';
import CharacterView from '../Character/CharacterView';

// Константы
const VIEWS = ['Profile', 'City', 'Raid', 'World', 'Tasks'];
const BASE_RESOURCES = { light: 0, energy: 0, crystals: 100, city_phase: 0 };

// Построение карты персонажей по id
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
  const { t, i18n } = useTranslation();

  // Состояния
  const [view, setView] = useState('home');
  const [profiles, setProfiles] = useState([]);     // один активный профиль в profiles[0]
  const [current, setCurrent] = useState(0);        // индекс по ключам CHAR_MAP
  const [resources, setResources] = useState({ ...BASE_RESOURCES });
  const [showFirstRunModal, setShowFirstRunModal] = useState(!localStorage.getItem('character'));

  // Гидратация из CHAR_MAP по ключу
  const hydrateFromCharacter = useCallback((key) => {
    if (key && CHAR_MAP[key]) {
      const profile = { ...CHAR_MAP[key] };
      setProfiles([profile]);                 // держим одного активного
      setResources({ ...BASE_RESOURCES });    // сброс ресурсов при смене
      return true;
    }
    return false;
  }, []);

  // Стартовая загрузка: восстановить сохранённого или выбрать первого (fallback)
  useEffect(() => {
    const saved = localStorage.getItem('character');
    const keys = Object.keys(CHAR_MAP);

    if (saved && CHAR_MAP[saved]) {
      hydrateFromCharacter(saved);
      setCurrent(Math.max(0, keys.indexOf(saved)));
      setShowFirstRunModal(false);
      return;
    }

    if (!keys.length) {
      // Нет персонажей — показываем модалку
      setShowFirstRunModal(true);
      return;
    }

    // Fallback: чтобы не висеть на Loading — выбираем первого
    const first = keys[0];
    localStorage.setItem('character', first);
    hydrateFromCharacter(first);
    setCurrent(0);
    setShowFirstRunModal(false);
  }, [hydrateFromCharacter]);

  // Переключение персонажа по кругу
  const handleSwitchCharacter = (dir = 'next') => {
    const keys = Object.keys(CHAR_MAP);
    if (!keys.length) return;

    setCurrent((prev) => {
      const safePrev = Number.isInteger(prev) ? prev : 0;
      const nextIndex =
        dir === 'prev'
          ? (safePrev - 1 + keys.length) % keys.length
          : (safePrev + 1) % keys.length;

      const nextKey = keys[nextIndex];
      localStorage.setItem('character', nextKey);
      hydrateFromCharacter(nextKey);
      return nextIndex;
    });
  };

  // Выбор персонажа из модалки первого запуска
  const handlePickFirstRun = (key) => {
    if (!CHAR_MAP[key]) return;
    const keys = Object.keys(CHAR_MAP);
    localStorage.setItem('character', key);
    hydrateFromCharacter(key);
    setCurrent(Math.max(0, keys.indexOf(key)));
    setShowFirstRunModal(false);
  };

  // Апгрейд текущего персонажа
  const handleUpgrade = () => {
    if (!profiles.length) return;
    setProfiles((prev) => {
      const next = [...prev];
      const cur = { ...next[0] };
      cur.level = (cur.level ?? 1) + 1;
      cur.strength = Math.min((cur.strength ?? 0) + 5, 100);
      cur.intelligence = Math.min((cur.intelligence ?? 0) + 5, 100);
      cur.reaction = Math.min((cur.reaction ?? 0) + 5, 100);
      cur.rage = Math.min((cur.rage ?? 0) + 5, 100);
      next[0] = cur;
      return next;
    });
  };

  // Лоадер: если нет профилей и нет модалки — ждём инициализации
  if (!profiles.length && !showFirstRunModal) {
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
      {profiles.length > 0 && (
        <section style={styles.section}>
          <div style={styles.card}>
            <CharacterView
              character={profiles[0]}
              onChange={handleSwitchCharacter}
              onUpgrade={handleUpgrade}
            />
          </div>
          <div style={styles.noteText}>
            {t('character_placeholder') || 'Здесь будет информация о персонаже'}
          </div>
        </section>
      )}

      {/* Секция ресурсов */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>{t('resources_view') || 'Resources View'}</div>
        <div style={styles.card}>
          <div style={styles.noteText}>
            {t('resources_placeholder') || 'Здесь будут ресурсы'}
          </div>
          <pre style={{ marginTop: 8 }}>{JSON.stringify(resources, null, 2)}</pre>
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

  sectionHeader: {
    marginBottom: 8,
    fontWeight: 700,
    letterSpacing: '0.08em',
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

  // Модалка
  modal: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 16,
  },

  modalContent: {
    background: '#0b0b0b',
    border: '1px solid #1e1e1e',
    borderRadius: 10,
    padding: 16,
    maxWidth: 520,
    width: '100%',
  },

  avatarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 12,
    marginTop: 12,
  },

  pickCard: {
    background: '#111',
    border: '1px solid #1e1e1e',
    borderRadius: 8,
    padding: 8,
    cursor: 'pointer',
    color: '#ececec',
  },

  avatarOption: {
    width: '100%',
    height: 90,
    objectFit: 'cover',
    borderRadius: 6,
    marginBottom: 6,
  },

  pickName: {
    fontSize: 12,
    textAlign: 'center',
  },
};
