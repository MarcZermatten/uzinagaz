import './AchievementsWindow.css';

// Mock data for now - will be replaced with real data in Phase 6
const mockAchievements = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Play your first game',
    icon: '🎮',
    points: 10,
    rarity: 'common',
    unlocked: true,
    unlocked_at: '2026-01-07T20:00:00Z',
  },
  {
    id: '2',
    title: 'Dedicated Gamer',
    description: 'Play for 10 hours total',
    icon: '⏰',
    points: 25,
    rarity: 'common',
    unlocked: false,
  },
  {
    id: '3',
    title: 'Collector',
    description: 'Upload 10 different games',
    icon: '📚',
    points: 50,
    rarity: 'rare',
    unlocked: false,
  },
  {
    id: '4',
    title: 'Console Connoisseur',
    description: 'Play games from 5 different consoles',
    icon: '🏅',
    points: 75,
    rarity: 'epic',
    unlocked: false,
  },
  {
    id: '5',
    title: 'Speed Runner',
    description: 'Complete a game in under 2 hours',
    icon: '⚡',
    points: 200,
    rarity: 'legendary',
    unlocked: false,
  },
];

export const AchievementsWindow = () => {
  const unlockedCount = mockAchievements.filter((a) => a.unlocked).length;
  const totalPoints = mockAchievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0);
  const maxPoints = mockAchievements.reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="achievements-window">
      <div className="achievements-header">
        <div className="progress-stats">
          <div className="stat-item">
            <span className="stat-label">Unlocked:</span>
            <span className="stat-value">
              {unlockedCount} / {mockAchievements.length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Points:</span>
            <span className="stat-value">
              {totalPoints} / {maxPoints}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completion:</span>
            <span className="stat-value">
              {Math.round((unlockedCount / mockAchievements.length) * 100)}%
            </span>
          </div>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${(unlockedCount / mockAchievements.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="achievements-list">
        {mockAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'} ${achievement.rarity}`}
          >
            <div className="achievement-icon">{achievement.icon}</div>
            <div className="achievement-info">
              <div className="achievement-title">
                {achievement.title}
                {achievement.unlocked && <span className="checkmark">✓</span>}
              </div>
              <div className="achievement-description">
                {achievement.description}
              </div>
              <div className="achievement-meta">
                <span className="achievement-points">{achievement.points} pts</span>
                <span className={`achievement-rarity rarity-${achievement.rarity}`}>
                  {achievement.rarity.toUpperCase()}
                </span>
                {achievement.unlocked && achievement.unlocked_at && (
                  <span className="achievement-date">
                    {new Date(achievement.unlocked_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
