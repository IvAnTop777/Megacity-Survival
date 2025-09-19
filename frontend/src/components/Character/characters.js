import Champion from '../../assets/avatars/Champion.png';
import CyberWarrior from '../../assets/avatars/CyberWarrior.png';
import CyberWitch from '../../assets/avatars/CyberWitch.png';
import Mystic from '../../assets/avatars/Mystic.png';
import Seer from '../../assets/avatars/Seer.png';
import Warrior from '../../assets/avatars/Warrior.png';

export const CHARACTERS = [
  { id: 'warrior',      name: 'Warrior',      avatar: Warrior,      level: 1, strength: 60, intelligence: 40, reaction: 50, rage: 30 },
  { id: 'champion',     name: 'Champion',     avatar: Champion,     level: 1, strength: 70, intelligence: 35, reaction: 45, rage: 40 },
  { id: 'seer',         name: 'Seer',         avatar: Seer,         level: 1, strength: 30, intelligence: 70, reaction: 40, rage: 20 },
  { id: 'mystic',       name: 'Mystic',       avatar: Mystic,       level: 1, strength: 40, intelligence: 65, reaction: 45, rage: 35 },
  { id: 'cyberwitch',   name: 'CyberWitch',   avatar: CyberWitch,   level: 1, strength: 35, intelligence: 60, reaction: 55, rage: 50 },
  { id: 'cyberwarrior', name: 'CyberWarrior', avatar: CyberWarrior, level: 1, strength: 65, intelligence: 45, reaction: 60, rage: 45 },
];
