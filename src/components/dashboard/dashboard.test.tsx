import axios, { AxiosStatic } from "axios";
import Dashboard from "./dashboard"
import { render, screen } from '@testing-library/react';


interface AxiosMock extends AxiosStatic {
    mockResolvedValue: Function
    mockRejectedValue: Function
  }
  
  jest.mock('axios')
  const mockAxios = axios as AxiosMock

describe('useMeteo tests', () => {
    beforeEach(() => {
        const mockGeolocation = {
            getCurrentPosition: jest.fn()
              .mockImplementationOnce((success) => Promise.resolve(success({
                coords: {
                  latitude: 52.5,
                  longitude: 0.12
                }
              })))
          };

        (window as any).navigator = mockGeolocation;    
      });

    test('show error screen when geo location not enabled', () => {


        mockAxios.mockResolvedValue({
            data: {
                "latitude": 52.52,
                "longitude": 13.41,
                "generationtime_ms": 0.5220174789428711,
                "utc_offset_seconds": 0,
                "timezone": "GMT",
                "timezone_abbreviation": "GMT",
                "elevation": 38.0,
                "daily_units": {
                    "time": "iso8601",
                    "temperature_2m_max": "°C",
                    "temperature_2m_min": "°C"
                },
                "daily": {
                    "time": [
                        "2023-08-27",
                        "2023-08-28",
                        "2023-08-29",
                        "2023-08-30",
                        "2023-08-31",
                        "2023-09-01",
                        "2023-09-02"
                    ],
                    "temperature_2m_max": [
                        20.2,
                        20.2,
                        15.7,
                        21.0,
                        21.3,
                        25.1,
                        26.7
                    ],
                    "temperature_2m_min": [
                        13.5,
                        12.0,
                        13.8,
                        13.2,
                        14.0,
                        12.7,
                        16.3
                    ]
                }
            }
          });
       
        render(<Dashboard />);


        const title = screen.getByText(/Enable geo location/i);

        expect(title).toBeInTheDocument();

    });
  });