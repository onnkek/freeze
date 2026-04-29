import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Status } from "../models/Status"
import ProductsService from "../services/ProductsService"
import { RootState } from "./store"

export interface ICategory {
  name: string
}

export interface ISettings {
  category: ICategory[]
  status: Status
}

const initialState: ISettings = {
  category: [],
  status: Status.Idle
}

const SettingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getSettings.pending, (state: ISettings) => {
        state.status = Status.Loading
      })
      .addCase(getSettings.fulfilled, (state: ISettings, action) => {
        state.status = Status.Succeeded
        state.category = action.payload
      })

      
  }
})


export const getSettings = createAsyncThunk(
  'settings/getSettings',

  async () => {
    return await new ProductsService().getSettings()
  })

// type NewProduct = {
//   category: string
//   name: string
//   qty: number
//   unit: string
//   date: string
//   months: number
// }
// export const createProduct = createAsyncThunk<IProduct[], NewProduct, { state: RootState }>(

//   'products/createProduct',
//   async (payload: NewProduct, { rejectWithValue, getState, dispatch }) => {

//     const expiresDate = new Date(payload.date + 'T00:00:00');  // YYYY-MM-DD → Date
//     expiresDate.setMonth(expiresDate.getMonth() + payload.months);
//     const expiresAt = expiresDate.toISOString().split('T')[0];  // YYYY-MM-DD


//     const newProduct: IProduct = {
//       id: crypto.randomUUID(),
//       category: payload.category,
//       name: payload.name,
//       qty: payload.qty,
//       unit: payload.unit,
//       frozenAt: payload.date,
//       months: payload.months,
//       expiresAt: expiresAt,
//       used: false
//     }

//     const response = await new ProductsService().createProduct(newProduct)

//     if (!response.ok) {
//       return rejectWithValue('Can\'t delete post! Server error!')
//     }
//     return response.body

//   }
// )

// export const updateUsedProduct = createAsyncThunk<IProduct[], string, { state: RootState }>(

//   'products/updateUsedProduct',
//   async (payload: string, { rejectWithValue, getState, dispatch }) => {
//     const state = getState()

//     const updatedProducts: IProduct[] = state.products.products.map(product =>
//       product.id === payload ?
//         { ...product, used: !product.used }
//         : product
//     )

//     const response = await new ProductsService().updateProducts(updatedProducts)

//     if (!response.ok) {
//       return rejectWithValue('Can\'t delete post! Server error!')
//     }
//     return updatedProducts

//   }
// )

// export const removeProduct = createAsyncThunk<IProduct[], string, { state: RootState }>(

//   'products/removeProduct',
//   async (payload: string, { rejectWithValue, getState, dispatch }) => {
//     const state = getState()

//     const updatedProducts: IProduct[] = state.products.products.filter(product => product.id !== payload)

//     const response = await new ProductsService().updateProducts(updatedProducts)

//     if (!response.ok) {
//       return rejectWithValue('Can\'t delete post! Server error!')
//     }
//     return updatedProducts

//   }
// )




export default SettingsSlice.reducer