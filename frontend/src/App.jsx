import HamburgerMenu from './components/HamburgerMenu'
import HorizontalMenu from './components/HorizontalMenu'
import EmployeeGrid from './components/EmployeeGrid'
import ThemeToggle from './components/ThemeToggle'
import './App.css'

function App() {
  return (
    <div className="app">
      <ThemeToggle />
      <HorizontalMenu />
      <HamburgerMenu />
      <main className="main-content">
        <EmployeeGrid />
      </main>
    </div>
  )
}

export default App
