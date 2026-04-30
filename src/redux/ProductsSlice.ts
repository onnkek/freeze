import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Status } from "../models/Status"
import ProductsService from "../services/ProductsService"
import { RootState } from "./store"

// export interface ITimeInfo {
//   year: number,
//   month: number,
//   day: number,
//   dayOfWeek: string,
//   hour: number,
//   minute: number,
//   second: number
// }

// interface IOutside {
//   temp: number,
//   hum: number
// }

// export interface ISystemInfo {
//   time: ITimeInfo,
//   chipTemp: number,
//   uptime: number,
//   totalSpace: number,
//   usedSpace: number,
//   freeSpace: number,
//   outside: IOutside,
//   freeHeap: number,
//   heapSize: number,
//   frequency: number
// }

// export interface IStatusInfo {
//   status: boolean
// }
// export interface IPunpInfo {
//   status: boolean,
//   introduced: number
// }

// export interface ITempStatusInfo {
//   status: number, // 0 - off, 1 - cool, 2 - heat, 3 - cool+heat
//   current: number,
//   cool: boolean,
//   heat: boolean
// }
// export interface IARGBStatusInfo {
//   status: boolean
// }


// export interface IPumpPeriod {
//   su: boolean
//   mo: boolean
//   tu: boolean
//   we: boolean
//   th: boolean
//   fr: boolean
//   sa: boolean
// }

// export interface IPumpConfig {
//   name: string,
//   dosage: number,
//   rate: number,
//   period: IPumpPeriod,
//   time: string,
//   currentVolume: number,
//   maxVolume: number,
//   mode: number, // 0 - off, 1 - on, 2 - auto,
//   status: number,
//   hasRunToday: boolean
// }
// export interface IPumpStatus {
//   status: number
// }

// export interface IRelay {
//   name: string,
//   on: string,
//   off: string,
//   mode: number
// }


// export interface IRGB {
//   r: number
//   g: number
//   b: number
// }

// interface IARGBGradient {
//   start: IRGB
//   end: IRGB
// }

// interface IARGBCycle {
//   speed: number
// }

// export interface IARGB {
//   name: string,
//   mode: number,
//   brightness: number,
//   static: IRGB,
//   gradient: IARGBGradient,
//   custom: IRGB[],
//   cycle: IARGBCycle,
//   on: string,
//   off: string
// }

// export interface ITemp {
//   name: string,
//   setting: number,
//   hysteresis: number,
//   k: number,
//   timeout: number,
//   mode: number // 0 - off, 1 - cool, 2 - heat, 3 - cool+heat, 4 - auto
// }

// export interface ISystem {
//   name: string,
//   update: number
// }

// export interface IConfig {
//   system: ISystem,
//   doser: IPumpConfig[],
//   co2: IRelay,
//   o2: IRelay,
//   light: IRelay,
//   filter: IRelay,
//   argb: IARGB,
//   temp: ITemp
// }
// export interface ICurrentInfo {
//   system: ISystemInfo,
//   doser: IPunpInfo[],
//   co2: IStatusInfo,
//   o2: IStatusInfo,
//   light: IStatusInfo,
//   filter: IStatusInfo
//   argb: IARGBStatusInfo,
//   temp: ITempStatusInfo,
// }


// interface ILogs {
//   system: string,
//   relay: string,
//   doser: string
// }
// interface IAquarium {
//   currentInfo: ICurrentInfo,
//   config: IConfig,
//   logs: ILogs,
//   status: Status,
//   logStatus: Status,
//   updateStatus: Status,
//   modal: boolean,
//   lastSuccess: number
// }
export interface IProduct {
  id: string
  category: string
  name: string
  qty: string
  unit: string
  frozenAt: string
  months: string
  expiresAt: string
  used: boolean
}

export interface IProducts {
  products: IProduct[]
  status: Status
  isModal: boolean
}

const initialState: IProducts = {
  products: [],
  status: Status.Idle,
  isModal: false
}

const ProductsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setModal: (state, action: PayloadAction<boolean>) => {
      state.isModal = action.payload
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getProducts.pending, (state: IProducts) => {
        state.status = Status.Loading
      })
      .addCase(getProducts.fulfilled, (state: IProducts, action) => {
        state.status = Status.Succeeded
        state.products = action.payload
      })

      .addCase(updateUsedProduct.pending, (state: IProducts) => {
        state.status = Status.Loading
      })
      .addCase(updateUsedProduct.fulfilled, (state: IProducts, action) => {
        state.status = Status.Succeeded
        state.products = action.payload
      })

      .addCase(removeProduct.pending, (state: IProducts) => {
        state.status = Status.Loading
      })
      .addCase(removeProduct.fulfilled, (state: IProducts, action) => {
        state.status = Status.Succeeded
        state.products = action.payload
      })

      .addCase(createProduct.pending, (state: IProducts) => {
        state.status = Status.Loading
      })
      .addCase(createProduct.fulfilled, (state: IProducts, action) => {
        const newProds = [...state.products];
        newProds.push(action.payload)
        state.products = newProds
        state.status = Status.Succeeded
      })
  }
})


export const getProducts = createAsyncThunk(
  'products/getProducts',

  async () => {
    return await new ProductsService().getProducts()
  })

type NewProduct = {
  category: string
  name: string
  qyolity: string
  unit: string
  date: string
  months: string
}
export const createProduct = createAsyncThunk<IProduct, NewProduct, { state: RootState }>(

  'products/createProduct',
  async (payload: NewProduct, { rejectWithValue, getState, dispatch }) => {
    console.log("THUNK")
    const expiresDate = new Date(payload.date + 'T00:00:00');  // YYYY-MM-DD → Date
    expiresDate.setMonth(expiresDate.getMonth() + Number(payload.months));
    const expiresAt = expiresDate.toISOString().split('T')[0];  // YYYY-MM-DD

    console.log("newProduct")
    const newProduct: IProduct = {
      id: "1",
      category: payload.category,
      name: payload.name,
      qty: payload.qyolity,
      unit: payload.unit,
      frozenAt: payload.date,
      months: payload.months,
      expiresAt: expiresAt,
      used: false
    }
    console.log("BEFORE createProduct")
    const response = await new ProductsService().createProduct(newProduct)

    if (!response.ok) {
      return rejectWithValue('Can\'t delete post! Server error!')
    }
    return newProduct

  }
)

export const updateProduct = createAsyncThunk<IProduct[], IProduct, { state: RootState }>(

  'products/updateProduct',
  async (payload: IProduct, { rejectWithValue, getState, dispatch }) => {
    const state = getState()

    const updatedProducts: IProduct[] = state.products.products.map(product =>
      product.id === payload.id ?
        {
          ...product,
          name: payload.name,
          category: payload.category,
          qty: payload.qty,
          unit: payload.unit,
          frozenAt: payload.frozenAt,
          months: payload.months
        }
        : product
    )

    const response = await new ProductsService().updateProducts(updatedProducts)

    if (!response.ok) {
      return rejectWithValue('Can\'t delete post! Server error!')
    }
    return updatedProducts

  }
)

export const updateUsedProduct = createAsyncThunk<IProduct[], string, { state: RootState }>(

  'products/updateUsedProduct',
  async (payload: string, { rejectWithValue, getState, dispatch }) => {
    const state = getState()

    const updatedProducts: IProduct[] = state.products.products.map(product =>
      product.id === payload ?
        { ...product, used: !product.used }
        : product
    )

    const response = await new ProductsService().updateProducts(updatedProducts)

    if (!response.ok) {
      return rejectWithValue('Can\'t delete post! Server error!')
    }
    return updatedProducts

  }
)

export const removeProduct = createAsyncThunk<IProduct[], string, { state: RootState }>(

  'products/removeProduct',
  async (payload: string, { rejectWithValue, getState, dispatch }) => {
    const state = getState()

    const updatedProducts: IProduct[] = state.products.products.filter(product => product.id !== payload)

    const response = await new ProductsService().updateProducts(updatedProducts)

    if (!response.ok) {
      return rejectWithValue('Can\'t delete post! Server error!')
    }
    return updatedProducts

  }
)

export const { setModal } = ProductsSlice.actions;
export default ProductsSlice.reducer