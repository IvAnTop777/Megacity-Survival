import React from 'react';
import { useTranslation } from 'react-i18next';
import './i18n'; // подключаем конфиг

export default function Dashboard({ resources, phase, biometricVerified }) {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  return (
    <div>
      {/* Языковой переключатель */}
      <select onChange={(e) => changeLanguage(e.target.value)}>
        <option value="ru">🇷🇺 Русский</option>
        <option value="en">🇬🇧 English</option>
        <option value="zh">🇨🇳 中文</option>
      </select>

      {/* Заголовок */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>{t('title')}</h1>
        <img src="/humanode-logo.png" alt="Humanode" style={{ height: '32px' }} />
      </div>
      <p>{t('subtitle')}</p>

      {/* Статус биометрии */}
      <div>
        {t('human')} {biometricVerified ? '🟢' : '🔴'}
      </div>

      {/* Ресурсы */}
      <div>
        <div>{t('energy')}: {resources.energy} / 5</div>
        <div>{t('crystals')}: {resources.crystals}</div>
        <div>{t('lifeEnergy')}: {resources.lifeEnergy}</div>
        <div>{t('phase')}: {phase.current} / {phase.total}</div>
        <div>{t('nextPhase')}: +{phase.pointsToNext}</div>
      </div>

      {/* Кошелёк */}
      <button>{t('connectWallet')}</button>

      {/* Навигация */}
      <nav>
        <button>{t('tabs.profile')}</button>
        <button>{t('tabs.city')}</button>
        <button>{t('tabs.raid')}</button>
        <button>{t('tabs.quests')}</button>
      </nav>
    </div>
  );
}
