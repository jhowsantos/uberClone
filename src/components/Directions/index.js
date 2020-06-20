import React from 'react'

import MapViewDirections from 'react-native-maps-directions';

const Directions = ({ destination , origin, onReady }) => (
    <MapViewDirections 
      destination={destination}
      origin={origin}
      onReady={onReady}
      apikey='AIzaSyCSB6MrmW1k5KoPSjscx5NRFuihPZzovoI'
      strokeWidth={3}
      strokeColor='#222'
    />
)

export default Directions;
