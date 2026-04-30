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
  qty: number
  unit: string
  frozenAt: string
  months: number
  expiresAt: string
  used: boolean
}

export interface IProducts {
  products: IProduct[]
  status: Status
}

const initialState: IProducts = {
  products: [],
  status: Status.Idle
}

const ProductsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // switchModal(state, action: PayloadAction<boolean>) {
    //   state.modal = action.payload
    // },
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
  qyolity: number
  unit: string
  date: string
  months: number
}
export const createProduct = createAsyncThunk<IProduct, NewProduct, { state: RootState }>(

  'products/createProduct',
  async (payload: NewProduct, { rejectWithValue, getState, dispatch }) => {
    console.log("THUNK")
    const expiresDate = new Date(payload.date + 'T00:00:00');  // YYYY-MM-DD → Date
    expiresDate.setMonth(expiresDate.getMonth() + payload.months);
    const expiresAt = expiresDate.toISOString().split('T')[0];  // YYYY-MM-DD

    console.log("newProduct")
    const newProduct: IProduct = {
      id:"1",
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


// export const getSystemLogs = createAsyncThunk(
//   'aquarium/getSystemLogs',

//   async () => {
//     return await new AquariumService().getSystemLogs()
//   })
// export const getRelayLogs = createAsyncThunk(
//   'aquarium/getRelayLogs',

//   async () => {
//     return await new AquariumService().getRelayLogs()
//   })
// export const getDoserLogs = createAsyncThunk(
//   'aquarium/getDoserLogs',

//   async () => {
//     return await new AquariumService().getDoserLogs()
//   })

// export const clearSystemLogs = createAsyncThunk(
//   'aquarium/clearSystemLogs',

//   async () => {
//     return await new AquariumService().clearSystemLogs()
//   })
// export const clearRelayLogs = createAsyncThunk(
//   'aquarium/clearRelayLogs',

//   async () => {
//     return await new AquariumService().clearRelayLogs()
//   })
// export const clearDoserLogs = createAsyncThunk(
//   'aquarium/clearDoserLogs',

//   async () => {
//     return await new AquariumService().clearDoserLogs()
//   })

// export const updateSystem = createAsyncThunk<IConfig, { update: number }, { state: RootState }>(

//   'aquarium/updateSystem',
//   async (payload: { update: number }, { rejectWithValue, getState, dispatch }) => {
//     const state = getState()

//     const newConfig: IConfig = { ...state.aquarium.config }
//     newConfig.system = { ...state.aquarium.config.system }
//     newConfig.system.update = payload.update
//     const response = await new AquariumService().updateConfig(newConfig)

//     if (!response.ok) {
//       return rejectWithValue('Can\'t delete post! Server error!')
//     }
//     return newConfig

//   }
// )

// export const updateDateTime = createAsyncThunk<ICurrentInfo, { dateTime: ITimeInfo }, { state: RootState }>(

//   'aquarium/updateDateTime',
//   async (payload: { dateTime: ITimeInfo }, { rejectWithValue, getState, dispatch }) => {
//     const state = getState()

//     const newCurrent: ICurrentInfo = { ...state.aquarium.currentInfo }
//     newCurrent.system = { ...state.aquarium.currentInfo.system }
//     newCurrent.system.time = payload.dateTime
//     const response = await new AquariumService().updateDateTime(payload.dateTime)

//     if (!response.ok) {
//       return rejectWithValue('Can\'t delete post! Server error!')
//     }
//     return newCurrent

//   }
// )

// export const updateCO2 = createAsyncThunk<IConfig, IRelay, { state: RootState }>(

//   'aquarium/updateCO2',
//   async (payload: IRelay, { rejectWithValue, getState, dispatch }) => {
//     const state = getState()

//     const newConfig: IConfig = { ...state.aquarium.config }
//     newConfig.co2 = { ...state.aquarium.config.co2 }
//     newConfig.co2.on = payload.on
//     newConfig.co2.off = payload.off
//     newConfig.co2.mode = payload.mode
//     const response = await new AquariumService().updateConfig(newConfig)

//     if (!response.ok) {
//       return rejectWithValue('Can\'t delete post! Server error!')
//     }
//     return newConfig

//   }
// )

// export const updateRelay = createAsyncThunk<IConfig, { subtype: string, relay: IRelay }, { state: RootState }>(
//   'aquarium/updateRelay',
//   async (payload: { subtype: string, relay: IRelay }, { rejectWithValue, getState, dispatch }) => {
//     const state = getState()

//     const newConfig: IConfig = { ...state.aquarium.config }
//     switch (payload.subtype) {
//       case "co2":
//         newConfig.co2 = { ...state.aquarium.config.co2 }
//         newConfig.co2.on = payload.relay.on
//         newConfig.co2.off = payload.relay.off
//         newConfig.co2.mode = payload.relay.mode
//         break;
//       case "o2":
//         newConfig.o2 = { ...state.aquarium.config.o2 }
//         newConfig.o2.on = payload.relay.on
//         newConfig.o2.off = payload.relay.off
//         newConfig.o2.mode = payload.relay.mode
//         break;
//       case "light":
//         newConfig.light = { ...state.aquarium.config.light }
//         newConfig.light.on = payload.relay.on
//         newConfig.light.off = payload.relay.off
//         newConfig.light.mode = payload.relay.mode
//         break;
//       case "filter":
//         newConfig.filter = { ...state.aquarium.config.filter }
//         newConfig.filter.on = payload.relay.on
//         newConfig.filter.off = payload.relay.off
//         newConfig.filter.mode = payload.relay.mode
//         break;
//     }

//     const response = await new AquariumService().updateConfig(newConfig)

//     if (!response.ok) {
//       return rejectWithValue('Can\'t delete post! Server error!')
//     }
//     return newConfig

//   }
// )

// export const updateFilter = createAsyncThunk<IConfig, IRelay, { state: RootState }>(

//   'aquarium/updateFilter',
//   async (payload: IRelay, { rejectWithValue, getState, dispatch }) => {
//     const state = getState()

//     const newConfig: IConfig = { ...state.aquarium.config }
//     newConfig.filter = { ...state.aquarium.config.filter }
//     newConfig.filter.on = payload.on
//     newConfig.filter.off = payload.off
//     newConfig.filter.mode = payload.mode
//     const response = await new AquariumService().updateConfig(newConfig)

//     if (!response.ok) {
//       return rejectWithValue('Can\'t delete post! Server error!')
//     }
//     return newConfig

//   }
// )

// export const updateO2 = createAsyncThunk<IConfig, IRelay, { state: RootState }>(

//   'aquarium/updateO2',
//   async (payload: IRelay, { rejectWithValue, getState, dispatch }) => {
//     const state = getState()

//     const newConfig: IConfig = { ...state.aquarium.config }
//     newConfig.o2 = { ...state.aquarium.config.o2 }
//     newConfig.o2.on = payload.on
//     newConfig.o2.off = payload.off
//     newConfig.o2.mode = payload.mode
//     const response = await new AquariumService().updateConfig(newConfig)

//     if (!response.ok) {
//       return rejectWithValue('Can\'t delete post! Server error!')
//     }
//     return newConfig

//   }
// )

// export const updateLight = createAsyncThunk<IConfig, IRelay, { state: RootState }>(

//   'aquarium/updateLight',
//   async (payload: IRelay, { rejectWithValue, getState, dispatch }) => {
//     const state = getState()

//     const newConfig: IConfig = { ...state.aquarium.config }
//     newConfig.light = { ...state.aquarium.config.light }
//     newConfig.light.on = payload.on
//     newConfig.light.off = payload.off
//     newConfig.light.mode = payload.mode
//     const response = await new AquariumService().updateConfig(newConfig)

//     if (!response.ok) {
//       return rejectWithValue('Can\'t delete post! Server error!')
//     }
//     return newConfig

//   }
// )

// export const updateTemp = createAsyncThunk<IConfig, ITemp, { state: RootState }>(

//   'aquarium/updateTemp',
//   async (payload: ITemp, { rejectWithValue, getState, dispatch }) => {
//     const state = getState()

//     const newConfig: IConfig = { ...state.aquarium.config }
//     newConfig.temp = { ...state.aquarium.config.temp }
//     newConfig.temp.setting = payload.setting
//     newConfig.temp.k = payload.k
//     newConfig.temp.hysteresis = payload.hysteresis
//     newConfig.temp.timeout = payload.timeout
//     newConfig.temp.mode = payload.mode
//     const response = await new AquariumService().updateConfig(newConfig)

//     if (!response.ok) {
//       return rejectWithValue('Can\'t delete post! Server error!')
//     }
//     return newConfig

//   }
// )

// export const updateARGB = createAsyncThunk<IConfig, IARGB, { state: RootState }>(

//   'aquarium/updateARGB',
//   async (payload: IARGB, { rejectWithValue, getState, dispatch }) => {
//     const state = getState()

//     const newConfig: IConfig = { ...state.aquarium.config }
//     newConfig.argb = { ...state.aquarium.config.argb }
//     newConfig.argb.mode = payload.mode
//     newConfig.argb.on = payload.on
//     newConfig.argb.off = payload.off
//     newConfig.argb.brightness = payload.brightness
//     newConfig.argb.static = payload.static
//     newConfig.argb.gradient = payload.gradient
//     newConfig.argb.custom = payload.custom
//     newConfig.argb.cycle = { ...state.aquarium.config.argb.cycle }
//     newConfig.argb.cycle.speed = payload.cycle.speed

//     const response = await new AquariumService().updateConfig(newConfig)

//     if (!response.ok) {
//       return rejectWithValue('Can\'t delete post! Server error!')
//     }
//     return newConfig

//   }
// )

// export const updateDoser = createAsyncThunk<IConfig, { number: number, config: IPumpConfig }, { state: RootState }>(

//   'aquarium/updateDoser',
//   async (payload: { number: number, config: IPumpConfig }, { rejectWithValue, getState, dispatch }) => {
//     const state = getState()

//     const newConfig: IConfig = { ...state.aquarium.config }
//     newConfig.doser = { ...state.aquarium.config.doser }
//     newConfig.doser[payload.number] = { ...state.aquarium.config.doser[payload.number] }
//     newConfig.doser[payload.number].name = payload.config.name
//     newConfig.doser[payload.number].dosage = payload.config.dosage
//     newConfig.doser[payload.number].rate = payload.config.rate
//     newConfig.doser[payload.number].hasRunToday = payload.config.hasRunToday
//     newConfig.doser[payload.number].time = payload.config.time
//     newConfig.doser[payload.number].currentVolume = payload.config.currentVolume
//     newConfig.doser[payload.number].maxVolume = payload.config.maxVolume
//     newConfig.doser[payload.number].period = payload.config.period
//     newConfig.doser[payload.number].mode = payload.config.mode

//     const response = await new AquariumService().updateConfig(newConfig)

//     if (!response.ok) {
//       return rejectWithValue('Can\'t delete post! Server error!')
//     }
//     return newConfig

//   }
// )

// export const resetPump = createAsyncThunk<IConfig, { number: number }, { state: RootState }>(

//   'aquarium/resetPump',
//   async (payload: { number: number }, { rejectWithValue, getState, dispatch }) => {
//     const state = getState()

//     const newConfig: IConfig = { ...state.aquarium.config }
//     newConfig.doser = { ...state.aquarium.config.doser }
//     newConfig.doser[payload.number] = { ...state.aquarium.config.doser[payload.number] }
//     newConfig.doser[payload.number].hasRunToday = !newConfig.doser[payload.number].hasRunToday

//     const response = await new AquariumService().updateConfig(newConfig)

//     if (!response.ok) {
//       return rejectWithValue('Can\'t delete post! Server error!')
//     }
//     return newConfig

//   }
// )

// export const {
//   switchModal
// } = AquariumSlice.actions

export default ProductsSlice.reducer