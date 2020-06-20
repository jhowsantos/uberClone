import React, { useEffect, useState, useRef } from 'react'
import { View, Image, ActivityIndicator } from 'react-native'

import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';

import { LocationBox, LocationText, LocationTimeBox, LocationTimeText, LocationTimeTextSmall, Back } from './styles';
import { getPixelSize } from '../../utils';

import markerImage from '../../assets/marker.png';
import backImage from '../../assets/back.png';


import Search from '../Search';
import Directions from '../Directions';
import Details from '../Details';

const Map = () => {
  const [loading, setLoading] = useState(true);
  const [destination, setDestionation] = useState(null);
  const [coordinates, setCoordinates] = useState({});
  const [duration , setDuration] = useState(null);
  const [location , setLocation] = useState('');
  // const [searchFocused, setSearchFocused] = useState(false);

  const mapRef = useRef(null);
  Geocoder.init('AIzaSyCSB6MrmW1k5KoPSjscx5NRFuihPZzovoI');

  useEffect(() => {
    Geolocation.getCurrentPosition(({coords}) => {
        setCoordinates(coords);
        setLoading(false);

        const { latitude, longitude } = coords;
        Geocoder.from({ lat:latitude, lng:longitude }).then(response => {

          const address = response.results[0].formatted_address;
          const locat = address.substring(0, address.indexOf(","));

          setLocation(locat);
        });

      },
      error => {
        console.log(error)
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );
  },[])

  const handleLocationSelected = (data, { geometry }) => {
    const { location: { lat: latitude, lng: longitude} } = geometry;

    setDestionation({
      latitude,
      longitude,
      title: data.structured_formatting.main_text
    })
  }

  const handleBack = () => {
    setDestionation(null)
  }

  return (
    <View style={{ flex: 1 }}>
      { loading ? (
        <ActivityIndicator size="large" />
      ):(
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: 0.014,
          longitudeDelta: 0.013
        }}
        
        showsUserLocation
        loadingEnabled
        ref={mapRef}
      >
        { destination && (
          <>
            <Directions 
              origin={coordinates}
              destination={destination}
              onReady={(result) => {
                setDuration(Math.floor(result.duration))

                mapRef.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: getPixelSize(50),
                    left: getPixelSize(50),
                    top: getPixelSize(50),
                    bottom: getPixelSize(350)
                  }
                })
              }}
            />
            <Marker 
              coordinate={coordinates}
              anchor={{ x: 0, y: 0 }}
            >
              <LocationBox>
                <LocationTimeBox>
                  <LocationTimeText>{duration}</LocationTimeText>
                  <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                </LocationTimeBox>
                <LocationText>{location}</LocationText>
              </LocationBox>
            </Marker>

            <Marker 
              coordinate={destination}
              anchor={{ x: 0, y: 0 }}
              image={markerImage}
            >
              <LocationBox>
                <LocationText>
                  {destination.title}
                </LocationText>
              </LocationBox>
            </Marker>
          </>
        )}
      </MapView>
      )}

      { destination ? (
        <>
          <Back onPress={handleBack}>
            <Image source={backImage} />
          </Back>
          <Details /> 
        </>
      ): 
      <Search onLocationSelected={handleLocationSelected} />
      }
    </View>
    
  )
}

export default Map;
