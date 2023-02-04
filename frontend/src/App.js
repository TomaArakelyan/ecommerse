import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import Home from './views/home'
import Product from "./views/product";

function App() {
  return (
    <BrowserRouter>
      <div>
        <header>
          <Link to="/"> 
          <img
                className="logo"
                src="https://miro.medium.com/v2/resize:fit:1400/format:webp/0*9hcinRdaHicrNpNE.jpg"
               
        />
          </Link>

        </header>
        <main>
          <Routes>
            <Route path = "/product/:id" element = {<Product/>} />
            <Route path = "/" element = {<Home/>}/>
          </Routes>
        
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
