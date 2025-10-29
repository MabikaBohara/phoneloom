import { configureStore } from '@reduxjs/toolkit';
import phonesReducer from './reducers/phones/phonesSlice';
import phoneDetailsReducer from './reducers/phones/phoneDetailsSlice';

import authReducer from './reducers/auth/authSlice';

import cartReducer from './reducers/cart/cartSlice';
import orderReducer from './reducers/order/orderSlice';

import adminOrderReducer from './reducers/admin/adminOrderSlice';
import adminProductReducer from './reducers/admin/adminProductSlice';

export const store = configureStore({
  reducer: {
    phones: phonesReducer,
    
    
    auth: authReducer,
    
    cart: cartReducer,
    order: orderReducer,
    
    adminOrder: adminOrderReducer,
    adminProduct: adminProductReducer
  },
});