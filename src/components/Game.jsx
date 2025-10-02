import React, { useEffect, useState } from 'react';

const GAME_WIDTH = 600;
const GAME_HEIGHT = 500;
const BASKET_WIDTH = 120;
const BASKET_HEIGHT = 50;

const itemsData = [
  { name: 'Apple', type: 'cheap', color: '#4ade80' },
  { name: 'Banana', type: 'cheap', color: '#facc15' },
  { name: 'TV', type: 'costly', color: '#f87171' },
  { name: 'Laptop', type: 'costly', color: '#f472b6' },
  { name: 'Bread', type: 'cheap', color: '#fbbf24' },
  { name: 'Perfume', type: 'costly', color: '#60a5fa' },
];

const Game = () => {
  const [basketX, setBasketX] = useState(GAME_WIDTH / 2 - BASKET_WIDTH / 2);
  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds timer

  // Move basket with arrow keys
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') setBasketX(prev => Math.max(prev - 25, 0));
      if (e.key === 'ArrowRight') setBasketX(prev => Math.min(prev + 25, GAME_WIDTH - BASKET_WIDTH));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Spawn items randomly
  useEffect(() => {
    const spawn = setInterval(() => {
      const randomItem = itemsData[Math.floor(Math.random() * itemsData.length)];
      setItems(prev => [
        ...prev,
        {
          ...randomItem,
          x: Math.random() * (GAME_WIDTH - 50),
          y: -50,
          size: 40 + Math.random() * 20,
          speed: 2 + Math.random() * 3,
          id: Date.now() + Math.random(),
        }
      ]);
    }, 800);
    return () => clearInterval(spawn);
  }, []);

  // Move items down
  useEffect(() => {
    const move = setInterval(() => {
      setItems(prev => prev.map(item => ({ ...item, y: item.y + item.speed })));
    }, 50);
    return () => clearInterval(move);
  }, []);

  // Detect collisions
  useEffect(() => {
    const checkCollision = () => {
      setItems(prev => {
        const newItems = [];
        prev.forEach(item => {
          if (
            item.y + item.size >= GAME_HEIGHT - BASKET_HEIGHT &&
            item.x + item.size > basketX &&
            item.x < basketX + BASKET_WIDTH
          ) {
            // Caught item
            if (item.type === 'cheap') setScore(s => s + 1);
            else setScore(s => Math.max(s - 1, 0));
          } else if (item.y < GAME_HEIGHT) {
            newItems.push(item);
          }
        });
        return newItems;
      });
    };
    const collisionInterval = setInterval(checkCollision, 50);
    return () => clearInterval(collisionInterval);
  }, [basketX, items]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div className="game-wrapper">
      <h2>Score: {score} | Time: {timeLeft}s</h2>
      {timeLeft === 0 && <h1 className="game-over">Game Over!</h1>}
      <div className="game-container" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
        {items.map(item => (
          <div key={item.id} className="item" style={{
            width: item.size,
            height: item.size,
            backgroundColor: item.color,
            top: item.y,
            left: item.x,
            fontSize: item.size / 4
          }}>
            {item.name}
          </div>
        ))}
        <div className="basket" style={{ left: basketX, width: BASKET_WIDTH, height: BASKET_HEIGHT }} />
      </div>
    </div>
  );
};

export default Game;