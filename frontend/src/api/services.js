import axios from "axios"
import { API_URL } from "../config"

// const { protocol, hostname } = window.location
// const API_URL = `${protocol}//${hostname}:5000`

export const createAuction = async (auctionData) => {
  return await axios.post(`${API_URL}/create-auction`, auctionData)
}

export const getAuctions = async () => {
  return await axios.get(`${API_URL}/view-auctions`)
}

export const placeBid = async (bidData) => {
  return await axios.post(`${API_URL}/place-bid`, bidData)
}

export const closeAuction = async (auctionId) => {
  return await axios.put(`${API_URL}/close-auction/${auctionId}`)
}

export const getAuctionDetails = async (auctionId) => {
  return await axios.get(`${API_URL}/auction/${auctionId}`)
}
