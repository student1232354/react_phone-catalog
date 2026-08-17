import './App.scss';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { HomePage } from './Components/HomePage';
import { NotFoundPage } from './Components/NotFoundPage';
import { Navbar } from './Components/Navbar';
import { NavbarFooter } from './Components/Navbarfooter';
import { Phones } from './Components/ProductsList/phones';
import { ProductPage } from './Components/ProductPage';
import { Favourites } from './Components/Favourites';
import { Tablets } from './Components/ProductsList/tablets';
import { Cart } from './Components/Cart';
import { Accessories } from './Components/ProductsList/accesorries';
import React, { useState, useEffect } from 'react';

export interface NewModel {
  id: number;
  category: string;
  itemId: string;
  name: string;
  fullPrice: number;
  price: number;
  screen: string;
  capacity: string;
  color: string;
  ram: string;
  year: number;
  image: string;
  selectedCapacity?: string;
  selectedColor?: string;
}

export interface CartItem extends NewModel {
  quantity: number;
}

export const AppContent: React.FC = () => {
  const [thisNewName, setthisNewName] = useState<string>('');
  const [models, setModels] = useState<NewModel[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<NewModel | null>(null);
  const [FavouritesA, setFavouritesA] = useState<NewModel[]>([]);
  const [cart, setcart] = useState<CartItem[]>([]);

  const getCartId = (item: NewModel) =>
    `${item.id}-${item.color}-${item.capacity}`;

  const addingObj = (obj: NewModel) => {
    setFavouritesA(prevArray => {
      const Existfb = prevArray.some(cobj => cobj.id === obj.id);

      if (Existfb) {
        return prevArray.filter(cobj => cobj.id !== obj.id);
      } else {
        return [...prevArray, obj];
      }
    });
  };

  const handleIncrease = (cartId: string) => {
    setcart(prev =>
      prev.map(item =>
        getCartId(item) === cartId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const handleDecrease = (cartId: string) => {
    setcart(prev =>
      prev
        .map(item =>
          getCartId(item) === cartId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter(item => item.quantity > 0),
    );
  };

  const addingObjCart = (obj: NewModel) => {
    setcart(prevArray => {
      const uniqueCartId = getCartId(obj);
      const exists = prevArray.some(cobj => getCartId(cobj) === uniqueCartId);

      if (exists) {
        return prevArray.filter(cobj => getCartId(cobj) !== uniqueCartId);
      } else {
        return [...prevArray, { ...obj, quantity: 1 }];
      }
    });
  };

  useEffect(() => {
    fetch('api/products.json')
      .then(response => response.json())
      .then(data => {
        setModels(data);
      })
      /* eslint-disable-next-line */
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  return (
    <>
      <div data-cy="app">
        {/* eslint-disable-next-line */}
        <Navbar cart={cart} favourites={FavouritesA} />
        <main className="section">
          <div className="container">
            <Routes>
              <Route
                path="/"
                element={
                  <HomePage
                    cart={cart}
                    addingObjCart={addingObjCart}
                    array={models}
                    setsmth={product => setSelectedProduct(product)}
                    addingObj={addingObj}
                    FavouritesA={FavouritesA}
                  />
                }
              />
              <Route
                path="/phones"
                element={
                  <Phones
                    cart={cart}
                    addingObjCart={addingObjCart}
                    array={models}
                    setsmth={product => setSelectedProduct(product)}
                    addingObj={addingObj}
                    FavouritesA={FavouritesA}
                  />
                }
              />

              <Route
                path="/tablets"
                element={
                  <Tablets
                    cart={cart}
                    addingObjCart={addingObjCart}
                    array={models}
                    setsmth={product => setSelectedProduct(product)}
                    addingObj={addingObj}
                    FavouritesA={FavouritesA}
                  />
                }
              />

              <Route
                path="/accessories"
                element={
                  <Accessories
                    cart={cart}
                    addingObjCart={addingObjCart}
                    array={models}
                    setsmth={product => setSelectedProduct(product)}
                    addingObj={addingObj}
                    FavouritesA={FavouritesA}
                  />
                }
              />

              <Route
                path="/:category/:productId"
                element={
                  <ProductPage
                    key={selectedProduct?.itemId || 'default'}
                    cart={cart}
                    addingObjCart={addingObjCart}
                    FavouritesA={FavouritesA}
                    addingObj={addingObj}
                    selectedProduct={selectedProduct}
                    setsmth={product => setSelectedProduct(product)}
                    thisNewName={thisNewName}
                  />
                }
              />

              <Route
                path="/favourites"
                element={
                  <Favourites
                    cart={cart}
                    addingObjCart={addingObjCart}
                    addingObj={addingObj}
                    FavouritesA={FavouritesA}
                  />
                }
              />
              <Route
                path="/cart"
                element={
                  <Cart
                    onIncrease={handleIncrease}
                    onDecrease={handleDecrease}
                    addingObjCart={addingObjCart}
                    cart={cart}
                    setthisNewName={setthisNewName}
                    setsmth={product => setSelectedProduct(product)}
                  />
                }
              />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </main>
        <NavbarFooter />
      </div>
    </>
  );
};

export const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};
