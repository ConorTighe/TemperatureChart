import axios from 'axios';

interface IGetMovingAvgTemp {
    lat: number;
    long: number;
}

class ForcastAPI {
  static getMovingAvgTemp = async ({ lat, long } : IGetMovingAvgTemp) :Promise <any | null> => {
    try {
      const data = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=temperature_2m_max&timezone=GMT`);

      return data;
    } catch (e) {
      console.error(e);
      return null;
    }
  };
}

export default ForcastAPI;