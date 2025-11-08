// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/store';
import CategoryListing from './Pages/CategoryListing';
import Layout from "./Layout";
import PhotographerProfile from "./Pages/PhotographerProfile";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/photographers" element={<CategoryListing />} />
            <Route path="/photographers/:id" element={<PhotographerProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
