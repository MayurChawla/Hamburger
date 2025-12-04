import HorizontalMenu from './components/HorizontalMenu'
import EmployeeGrid from './components/EmployeeGrid'
import './App.css'

function App() {
  return (
    <div className="app">
      <HorizontalMenu />
      <main className="main-content">
        <EmployeeGrid />
      </main>
    </div>
  )
}

export default App
