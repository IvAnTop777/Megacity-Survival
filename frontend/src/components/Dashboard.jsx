import React from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n';
import humanodeLogo from '../assets/humanode-logo.png'; // убедись, что логотип лежит в этой папке

export default function Dashboard({ resources, phase, biometricVerified }) {
  const { t, i18n } = useTranslation();

  const changeLanguage = (e) => i18n.changeLanguage(e.target.value);

  return (
    <div style={{
      padding: '16px',
      fontFamily: 'Orbitron, sans-serif',
      backgroundColor: '#0a0a0a',
      color: '#e0e0e0',
      minHeight: '100vh'
    }}>
      
      {/* Языковой переключатель */}
      <select onChange={changeLanguage} style={{ marginBottom: '12px' }}>
        <option value="ru">🇷🇺 Русский</option>
        <option value="en">🇬🇧 English</option>
        <option value="zh">🇨🇳 中文</option>
      </select>

      {/* Заголовок и логотип */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>{t('title')}</h1>
        <img src={humanodeLogo} alt="Humanode" style={{ height: '32px' }} />
      </div>
      <p style={{ fontSize: '12px', color: '#888' }}>{t('subtitle')}</p>

      {/* Статус биометрии */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
        <span>{t('human')}</span>
        <span style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: biometricVerified ? '#00ffcc' : '#ff0033',
          animation: biometricVerified ? 'blink 1s infinite' : 'none'
        }}></span>
      </div>

      {/* Ресурсы */}
      <div style={{ marginTop: '24px', lineHeight: '2' }}>
        <div>🔋 {t('energy')}: {resources.energy} / 5</div>
        <div>💠 {t('crystals')}: {resources.crystals}</div>
        <div>❤️ {t('lifeEnergy')}: {resources.lifeEnergy}</div>
        <div>🌆 {t('phase')}: {phase.current} / {phase.total}</div>
        <div>⬆ {t('nextPhase')}: +{phase.pointsToNext}</div>
      </div>

      {/* Кошелёк */}
      <button style={{
        marginTop: '16px',
        padding: '10px 16px',
        backgroundColor: '#222',
        color: '#00ffcc',
        border: '1px solid #00ffcc',
        borderRadius: '6px'
      }}>
        {t('connectWallet')}
      </button>

      {/* Навигация */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '32px',
        borderTop: '1px solid #333',
        paddingTop: '12px'
      }}>
        <button>{t('tabs.profile')}</button>
        <button>{t('tabs.city')}</button>
        <button>{t('tabs.raid')}</button>
        <button>{t('tabs.quests')}</button>
      </nav>
    </div>
  );
}
