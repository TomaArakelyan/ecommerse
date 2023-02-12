import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import HomeScreen from './views/home'
import ProductScreen from "./views/product";

function App() {
  return (
    <BrowserRouter>
      <div>
        <header>
          <Link to="/"> 
          <img
                className="logo"
                src="https://miro.medium.com/v2/resize:fit:1400/format:webp/0*9hcinRdaHicrNpNE.jpg"
                alt = 'logo'
               
        />
          </Link>

        </header>
        <main>
          <Routes>
            <Route path = "/product/:id" element = {<ProductScreen/>} />
            <Route path = "/" element = {<HomeScreen/>}/>
          </Routes>
        
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
