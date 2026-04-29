import { configureStore } from '@reduxjs/toolkit'
import ProductsReducer from './ProductsSlice'
import SettingsReducer from './SettingsSlice'

const store = configureStore({
    reducer: {
        products: ProductsReducer,
        settings: SettingsReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store