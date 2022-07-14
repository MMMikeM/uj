import Cool from "./cool"
import "./index.css"
import NewThree from "./newThree"
import ReactThree from "./ReactThree"
import Three from "./three"

function App() {
  // return <NewThree />
  return <Cool />
  const useOld = true
  return useOld ? <Three /> : <ReactThree />
}

export default App
