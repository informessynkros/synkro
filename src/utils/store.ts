import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../helpers/redux/AuthSlice'


export const store = configureStore({
  reducer: {
    authUser: authReducer
  }
})