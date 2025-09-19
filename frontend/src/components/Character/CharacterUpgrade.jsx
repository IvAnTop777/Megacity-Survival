import React from 'react';
import CharacterUpgrade from './CharacterUpgrade';

export default function CharacterView({ character, setCharacter }) {
  return (
    <div style={styles.card}>
      <h3 style={{ marginTop: 0 }}>Character</h3>
      <div style={{ marginBottom: 8 }}><b>Name:</b> {character.name}</div>
      <div style={{ marginBottom: 8 }}><b>Class:</b> {character.class}</div>
      <div style={{ marginBottom: 8 }}><b>Level:</b> {character.level}</div>
      <div style={{ marginBottom: 8 }}><b>Strength:</b> {character.strength}</div>
      <div style={{ marginBottom: 8 }}><b>Intelligence:</b> {character.intelligence}</div>
      <div style={{ marginBottom: 8 }}><b>Reaction:</b> {character.reaction}</div>

      <CharacterUpgrade character={character} setCharacter={setCharacter} />
    </div>
  );
}

const styles = {
  card: {
    border: '1px solid #333',
    borderRadius: 8,
    padding: 16,
    background: '#0d0d0d',
  },
};