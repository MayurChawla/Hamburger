import HamburgerMenu from './components/HamburgerMenu'
import './App.css'

function App() {
  return (
    <div className="app">
      <HamburgerMenu />
      <main className="main-content">
        <h1>Welcome</h1>
        <p>Click the hamburger menu icon in the top-left corner to open the navigation menu.</p>
        <p>Some menu items have sub-menus that you can expand by clicking on them.</p>
      </main>
    </div>
  )
}

export default App
