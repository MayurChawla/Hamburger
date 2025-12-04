import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 3V1M10 19V17M17 10H19M1 10H3M15.657 4.343L17.071 2.929M2.929 17.071L4.343 15.657M15.657 15.657L17.071 17.071M2.929 2.929L4.343 4.343M14 10C14 12.2091 12.2091 14 10 14C7.79086 14 6 12.2091 6 10C6 7.79086 7.79086 6 10 6C12.2091 6 14 7.79086 14 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.293 13.293C16.3785 14.2075 15.2348 14.8616 14 15.1935C12.7652 15.5254 11.4713 15.5254 10.2365 15.1935C9.00167 14.8616 7.85801 14.2075 6.9435 13.293C6.02899 12.3785 5.3749 11.2348 5.043 10C4.7111 8.76523 4.7111 7.47134 5.043 6.23657C5.3749 5.00179 6.02899 3.85813 6.9435 2.94362C7.85801 2.02911 9.00167 1.37502 10.2365 1.04312C11.4713 0.711222 12.7652 0.711222 14 1.04312C15.2348 1.37502 16.3785 2.02911 17.293 2.94362" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;

