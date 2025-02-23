import axios from "axios"

const { protocol, hostname } = window.location
const API_URL = `${protocol}//${hostname}:5000`
// const API_URL = `http://10.183.22.70:5000`

export const createAuction = async (auctionData) => {
  return await axios.post(`${API_URL}/create-auction`, auctionData)
}

export const getActiveAuctions = async () => {
  return await axios.get(`${API_URL}/view-auctions`)
}

export const placeBid = async (bidData) => {
  return await axios.post(`${API_URL}/place-bid`, bidData)
}

export const getAuctionDetails = async (auctionId) => {
  return await axios.get(`${API_URL}/auction/${auctionId}`)
}
