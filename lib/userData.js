import { getToken } from "@/lib/authenticate";

// Function to make authenticated requests to the API
const makeRequest = async (endpoint, method, data = null) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`;
  const token = await getToken();

  try {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `JWT ${token}`,
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    return response.status === 200 ? await response.json() : [];
  } catch (error) {
    console.error("Error making API request:", error);
    return [];
  }
};

// Functions to manage favorites and history
export const addToFavourites = (id) => makeRequest(`/api/user/favourites/${id}`, "PUT");
export const removeFromFavourites = (id) => makeRequest(`/api/user/favourites/${id}`, "DELETE");
export const getFavourites = () => makeRequest(`/api/user/favourites`, "GET");
export const addToHistory = (id) => makeRequest(`/api/user/history/${id}`, "PUT");
export const removeFromHistory = (id) => makeRequest(`/api/user/history/${id}`, "DELETE");
export const getHistory = () => makeRequest(`/api/user/history`, "GET");