import axios from 'axios';

interface IGetMovingAvgTemp {
    lat: number;
    long: number;
}

interface IGetMovingAvgWaveHeight {
  lat: number;
  long: number;
}

class OpenMeteo {
  static getMovingAvgTemp = async ({ lat, long } : IGetMovingAvgTemp) :Promise <any | null> => {
    try {
      const { data } = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`);

      return data;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  static getMovingAvgWaveHeight = async ({ lat, long } : IGetMovingAvgWaveHeight) :Promise <any | null> => {
    try {
      const { data } = await axios.get(`https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${long}&daily=wave_height_max,swell_wave_height_max&timezone=auto`);

      return data;
    } catch (e) {
      console.error(e);
      return null;
    }
  };
}

export default OpenMeteo;