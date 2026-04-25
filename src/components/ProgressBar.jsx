export default function ProgressBar({ current, total, percent }) {
  const barWidth = 30;
  const filled = Math.round((percent / 100) * barWidth);
  const empty = barWidth - filled;

  const filledStr = '█'.repeat(filled);
  const emptyStr = '░'.repeat(empty);

  return (
    <div className="progress-container" id="progress-bar">
      <span className="progress-text">WRITING TO DISK... [</span>
      <span className="progress-filled">{filledStr}</span>
      <span className="progress-empty">{emptyStr}</span>
      <span className="progress-text">] {percent}%   {current} OF {total} FILES</span>
    </div>
  );
}
