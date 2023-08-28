import {useState, useEffect, SetStateAction} from 'react';

export interface IGeoLocation {
    latitude?: number;
    longitude?: number;
}


const useGeoLocation = () => {
  const [position, setPosition] = useState<IGeoLocation>({});
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

export default useGeoLocation