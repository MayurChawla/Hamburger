import HamburgerMenu from './components/HamburgerMenu'
import HorizontalMenu from './components/HorizontalMenu'
import './App.css'

function App() {
  return (
    <div className="app">
      <HorizontalMenu />
      <HamburgerMenu />
      <main className="main-content">
        <h1>Welcome</h1>
        <p>This page features both a horizontal menu at the top and a hamburger menu in the top-left corner.</p>
        <p>Hover over menu items in the horizontal menu to see sub-menus, or click the hamburger icon for the mobile-friendly menu.</p>
      </main>
    </div>
  )
}

export default App
