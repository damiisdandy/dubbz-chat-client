import axios from "axios"


const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL + '/api',
});

export const getMessages = async () => {
  const resData = await axiosInstance.get('/message/all');
  return resData.data.data;
}

export const createMessage = async (data: {
  text: string;
  source: string;
}) => {
  const resData = await axiosInstance.post('/message/create', { ...data });
  return resData.data.data;
}

export const deleteMessage = async ({ id, apiKey }: { id: number, apiKey: string }) => {
  const resData = await axiosInstance.delete(`/message/delete/${id}`, {
    headers: {
      'X-Api-Key': apiKey,
    }
  });
  return resData.data.data;
}

export const deleteAllMessages = async ({ apiKey }: { apiKey: string }) => {
  const resData = await axiosInstance.delete(`/message/delete/all`, {
    headers: {
      'X-Api-Key': apiKey,
    }
  });
  return resData.data.data;
}

export const getUserIPAddress = async () => {
  const resData = await axios.get('https://geolocation-db.com/json/');
  return resData.data.IPv4;
}
