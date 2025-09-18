// src/components/CharacterDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

// Нижняя навигация
const VIEWS = ['Profile', 'City', 'Raid', 'World', 'Tasks'];

// Словарь персонажей (вариант 2)
const CHARACTERS = {
  warrior: {
    avatar: '/avatars/warrior.png',
    name: 'Warrior',
    class: 'Fighter',
    gender: 'Male',
    level: 5,
    strength: 70,
    intelligence: 30,
    reaction: 40,
    to_next_level: 80
  },
  mage: {
    avatar: '/avatars/mage.png',
    name: 'Mage',
    class: 'Wizard',
    gender: 'Female',
    level: 7,
    strength: 20,
    intelligence: 90,
    reaction: 50,
    to_next_level: 60
  },
  rogue: {
    avatar: '/avatars/rogue.png',
    name: 'Rogue',
    class: 'Assassin',
    gender: 'Male',
    level: 6,
    strength: 50,
    intelligence: 40,
    reaction: 80,
    to_next_level: 70
  },
  seer_female: {
    avatar: '/avatars/seer_female.png',
    name: 'Seer',
    class: 'Oracle',
    gender: 'Female',
    level: 9,
    strength: 20,
    intelligence: 80,
    reaction: 50,
    to_next_level: 100
  },
  seer_male: {
    avatar: '/avatars/seer_male.png',
    name: 'Seer',
    class: 'Oracle',
    gender: 'Male',
    level: 9,
    strength: 25,
    intelligence: 75,
    reaction: 55,
    to_next_level: 100
  },
  hunter: {
    avatar: '/avatars/hunter.png',
    name: 'Hunter',
    class: 'Ranger',
    gender: 'Male',
    level: 8,
    strength: 65,
    intelligence: 45,
    reaction: 70,
    to_next_level: 90
  }
};

// Базовые ресурсы
const BASE_RESOURCES = { light: 0, energy: 0, crystals: 100, city_phase: 0 };

export default function CharacterDashboard() {
  const { t, i18n } = useTranslation();

  // Состояния
  const [view, setView] = useState('Profile');
  const [data, setData] = useState(null); // { profile: {...}, resources: {...} }
  const [showFirstRunModal, setShowFirstRunModal] = useState(!localStorage.getItem('character'));
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Нормализация процентов
  const clamp = (v) => Math.max(0, Math.min(100, Number.isFinite(v) ? v : 0));

  // Гидратация из ключа
  const hydrateFromCharacter = useCallback((key) => {
    if (key && CHARACTERS[key]) {
      setData({
        profile: { ...CHARACTERS[key] },
        resources: { ...BASE_RESOURCES }
      });
      return true;
    }
    return false;
  }, []);

  // Инициализация при монтировании
  useEffect(() => {
    const saved = localStorage.getItem("character");
    if (saved) {
      hydrateFromCharacter(saved);
      setShowFirstRunModal(false);
    } else {
      setShowFirstRunModal(true);
    }
  
    // снимаем "loading" через 1.5 секунды
    const timer = setTimeout(() => setLoading(false), 1500);
  
    return () => {
      clearTimeout(timer);
    };
  }, [hydrateFromCharacter]);

  // Обработчики выбора
  const handlePickFirstRun = (key) => {
    localStorage.setItem('character', key);
    hydrateFromCharacter(key);
    setShowFirstRunModal(false);
  };

  const handleChangeCharacter = (key) => {
    localStorage.setItem('character', key);
    hydrateFromCharacter(key);
    setShowChangeModal(false);
  };

  // Прелоадер, если данных ещё нет и не идёт первичная модалка
  if (loading) {
    return (
      <div style={styles.page}>
        <div style={{ marginTop: 100 }}>Загрузка… ⏳</div>
      </div>
    );
  }
  if (!data && showFirstRunModal) {
    // Показываем модалку выбора персонажа
    return (
      <div style={styles.page}>
        <div style={{ marginTop: 100 }}>
          {/* Здесь у тебя уже есть компонент модалки выбора */}
        </div>
      </div>
    );
  }
  
  if (!data && !showFirstRunModal) {
    // Если данных нет и модалка не открыта — аварийный fallback
    return (
      <div style={styles.page}>
        <div style={{ marginTop: 100 }}>Нет данных персонажа 🕵️‍♂️</div>
      </div>
    );
  }
  return (
    <div style={styles.page}>
      {/* Модалка первого запуска */}
      {showFirstRunModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={{ marginTop: 0 }}>{t('select_character') || 'Select Your Character'}</h3>
            <div style={styles.avatarGrid}>
              {Object.entries(CHARACTERS).map(([key, char]) => (
                <div key={key} style={styles.pickCard} onClick={() => handlePickFirstRun(key)}>
                  <img src={char.avatar} alt={char.name} style={styles.avatarOption} />
                  <div style={styles.pickName}>{char.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Верхняя панель: язык → Connect Wallet */}
      <div style={styles.topbar}>
        <select
          style={styles.select}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          defaultValue="en"
        >
          <option value="en">🇬🇧</option>
          <option value="ru">🇷🇺</option>
          <option value="vi">🇻🇳</option>
          <option value="zh">🇨🇳</option>
        </select>
        <button style={styles.button}>{t('connect_wallet') || 'Connect Wallet'}</button>
      </div>

      {/* Логотип: сначала текст, затем картинка */}
      <div style={styles.logo}>
        <h1 style={{ margin: 0, fontSize: 22, letterSpacing: '0.06em' }}>
          {t('megacity') || 'MEGACITY'}
        </h1>
        <img
          src={`${process.env.PUBLIC_URL || ''}/logo_humanode.png`}
          alt="Humanode"
          height={28}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      {/* Only for humans */}
      <div style={styles.humanLine}>
        <span style={{ fontSize: 14 }}>{t('only_for_humans') || 'Only for humans'}</span>
        <div style={styles.humanBadge(true)}>{t('human') || 'HUMAN'}</div>
      </div>

      {/* Персонаж и статсы */}
      {data && (
        <div style={styles.characterBlock}>
          {/* Аватар + кнопка смены */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={styles.avatar}>
              <img
                src={data.profile.avatar}
                alt={data.profile.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={styles.levelTag}>
                Lv.{String(data.profile.level).padStart(2, '0')}
              </div>
            </div>
            <button style={styles.changeBtn} onClick={() => setShowChangeModal(true)}>
              {t('change_character') || 'Сменить персонажа'}
            </button>
          </div>

          {/* Инфо и прогресс-бары */}
          <div style={styles.stats}>
            <h3 style={{ marginTop: 0 }}>{t('character_profile') || 'Character profile'}</h3>
            <div><b>{t('name') || 'Name'}:</b> {data.profile.name}</div>
            <div><b>{t('class') || 'Class'}:</b> {data.profile.class}</div>
            <div><b>{t('gender') || 'Gender'}:</b> {data.profile.gender}</div>
            <br />
            {[
              { k: 'strength', label: t('strength') || 'Strength' },
              { k: 'intelligence', label: t('intelligence') || 'Intelligence' },
              { k: 'reaction', label: t('reaction') || 'Reaction' },
              { k: 'to_next_level', label: t('to_next_level') || 'To next level' }
            ].map(({ k, label }) => (
              <div key={k} style={{ marginBottom: 10 }}>
                <b>{label}:</b>
                <div style={styles.barContainer}>
                  <div style={styles.barFill(clamp(data.profile[k]))} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ресурсы */}
      {data && (
        <div style={styles.resources}>
          {[
            { k: 'light', label: t('light') || 'Light', emoji: '🌟' },
            { k: 'energy', label: t('energy') || 'Energy', emoji: '⚡' },
            { k: 'crystals', label: t('crystals') || 'Crystals', emoji: '💎' },
            { k: 'city_phase', label: t('city_phase') || 'City phase', emoji: '🏙️' }
          ].map(({ k, label, emoji }) => (
            <div key={k} style={styles.resourceRow}>
              <span>{emoji} {label}:</span>
              <span>{data.resources[k]}</span>
            </div>
          ))}
        </div>
      )}

      {/* Нижняя навигация */}
      <div style={styles.bottomNav}>
        {VIEWS.map((v, idx) => (
          <button
            key={v}
            style={{
              ...styles.navButton(view === v),
              borderRight: idx === VIEWS.length - 1 ? 'none' : '1px solid #333'
            }}
            onClick={() => setView(v)}
          >
            {(t(v.toLowerCase()) || v).toUpperCase()}
          </button>
        ))}
      </div>

      {/* Модалка смены персонажа (после первого выбора) */}
      {showChangeModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={{ marginTop: 0 }}>{t('choose_new_character') || 'Выберите нового персонажа'}</h3>
            <div style={styles.avatarGrid}>
              {Object.entries(CHARACTERS).map(([key, char]) => (
                <div key={key} style={styles.pickCard} onClick={() => handleChangeCharacter(key)}>
                  <img src={char.avatar} alt={char.name} style={styles.avatarOption} />
                  <div style={styles.pickName}>{char.name}</div>
                </div>
              ))}
            </div>
            <button style={styles.button} onClick={() => setShowChangeModal(false)}>
              {t('cancel') || 'Отмена'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Стили
const styles = {
  page: {
    background: '#000',
    color: '#ececec',
    fontFamily: 'Orbitron, sans-serif',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16
  },

  topbar: {
    width: '100%',
    maxWidth: 500,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },

  select: {
    border: '1px solid #555',
    borderRadius: 6,
    background: '#1a1a1a',
    color: '#ececec',
    padding: 6,
    cursor: 'pointer'
  },

  button: {
    border: '1px solid #555',
    borderRadius: 6,
    background: '#1a1a1a',
    color: '#ececec',
    padding: '6px 12px',
    cursor: 'pointer'
  },

  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8
  },

  humanLine: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24
  },

  humanBadge: (isHuman) => ({
    padding: '4px 10px',
    borderRadius: 12,
    background: isHuman ? '#00ff00' : '#ff0044',
    color: '#121212',
    fontWeight: 'bold',
    fontSize: 12
  }),

  characterBlock: {
    display: 'flex',
    width: '100%',
    maxWidth: 500,
    gap: 24,
    marginBottom: 24,
    flexWrap: 'wrap'
  },

  stats: {
    flex: 1,
    minWidth: 200
  },

  avatar: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: '50%',
    overflow: 'hidden',
    border: '2px solid #444',
    background: '#222'
  },

  levelTag: {
    position: 'absolute',
    bottom: -14,
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#444',
    color: '#fff',
    padding: '2px 8px',
    borderRadius: 6,
    fontSize: 12
  },

  changeBtn: {
    marginTop: 12,
    padding: '6px 12px',
    border: '1px solid #555',
    borderRadius: 6,
    background: '#1a1a1a',
    color: '#ececec',
    cursor: 'pointer'
  },

  barContainer: {
    background: '#333',
    borderRadius: 4,
    height: 10,
    marginTop: 4,
    overflow: 'hidden'
  },

  barFill: (pct) => ({
    width: `${pct}%`,
    height: '100%',
    background: '#ececec'
  }),

  resources: {
    width: '100%',
    maxWidth: 500,
    marginBottom: 72
  },

  resourceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 8
  },

  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    background: '#111',
    borderTop: '1px solid #444',
    display: 'flex',
    padding: 0
  },

  navButton: (active) => ({
    flex: 1,
    background: 'transparent',
    border: 'none',
    borderRight: '1px solid #333',
    color: active ? '#00ff00' : '#ececec',
    fontWeight: active ? '700' : '400',
    cursor: 'pointer',
    padding: '14px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.06em'
  }),

  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },

  modalContent: {
    background: '#1a1a1a',
    padding: 24,
    borderRadius: 8,
    width: '100%',
    maxWidth: 480
  },

  avatarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 12,
    margin: '16px 0'
  },

  pickCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    border: '1px solid #333',
    borderRadius: 8,
    padding: 8,
    background: '#0d0d0d'
  },

  pickName: {
    marginTop: 6,
    fontSize: 12,
    opacity: 0.9
  },

  avatarOption: {
    width: 84,
    height: 84,
    borderRadius: 8,
    border: '2px solid #444',
    objectFit: 'cover'
  }
};
