import {useState, useEffect, SetStateAction} from 'react';

interface IGetMovingAvgTemp {
    latitude?: number;
    longitude?: number;
}


export const useLocation = () => {
  const [position, setPosition] = useState<IGetMovingAvgTemp>({});
  const [error, setError] = useState<string>();
  
  const onChange = ({coords}: any) => {
    setPosition({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
  };

  const onError = (error: { message: SetStateAction<string | undefined>; }) => {
    setError(error.message);
  };
  useEffect(() => {
    const geo = navigator.geolocation;
    if (!geo) {
      setError('Geolocation is not supported');
      return;
    }
    const watcher = geo.watchPosition(onChange, onError);
    return () => geo.clearWatch(watcher);
  }, []);
  return {...position, error};
}