import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../../redux/store';
import AppRoutes from '../AppRoutes';
import './App.scss';

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Suspense fallback={null}>
          <AppRoutes />
          <ToastContainer
            hideProgressBar
            pauseOnHover={false}
            pauseOnFocusLoss={false}
          />
        </Suspense>
      </PersistGate>
    </Provider>
  );
}

export default App;
