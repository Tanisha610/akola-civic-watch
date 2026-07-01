import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button className="btn-secondary px-4 py-2" onClick={toggleTheme} aria-pressed={isDark}>
      {isDark ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
