import { IProduct } from "redux/ProductsSlice"

export default class AquariumService {

  _apiBase: string
  _apiProducts: string
  _apiSettings: string


  constructor() {
    this._apiBase = "http://localhost:8000"
    this._apiProducts = "products"
    this._apiSettings = "settings"
  }

  getProducts = async () => {
    const response = await fetch(`${this._apiBase}/${this._apiProducts}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    })
    return await response.json()
  }
  getSettings = async () => {
    const response = await fetch(`${this._apiBase}/${this._apiSettings}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    })
    return await response.json()
  }
  createProduct = async (data: IProduct) => {
    const response = await fetch(`${this._apiBase}/${this._apiProducts}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    return await response.json()
  }
  updateProducts = async (data: IProduct[]) => {
    const response = await fetch(`${this._apiBase}/${this._apiProducts}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    return await response.json()
  }


  // updateConfig = async (data: IConfig) => {
  //   const response = await fetch(`${this._apiBase}/${this._apiConfig}`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify(data)
  //   })
  //   return await response
  // }
}