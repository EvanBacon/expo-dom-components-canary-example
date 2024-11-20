import React from 'react';
import { ScrollView, SafeAreaView, Platform, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import tw from 'twrnc'; // Make sure to install twrnc
import CheckoutDetails from '@/components/native/checkout-details';
import SwipeToOrderButton from '@/components/native/order-button';
import { useRestaurantStore } from '@/lib/store/restaurantStore';
import { useCompanyStore } from '@/lib/store/companyStore';
import { useLocalSearchParams } from 'expo-router';
import { useCartStore } from '@/lib/store/orderStore';

export default function CheckoutScreen() {
  const { restaurant: restaurantId } = useLocalSearchParams();

  // Coordinates for the restaurant and company
  const { selectedRestaurant }= useRestaurantStore();
  const restaurantCoords = { latitude: selectedRestaurant?.location.coordinates[1] as any, longitude: selectedRestaurant?.location.coordinates[0] as any};

  const { selectedCompanyData } = useCompanyStore();
  const companyCoords = { latitude: selectedCompanyData.coordinates.lng , longitude: selectedCompanyData.coordinates.lat };

  // Determine the initial region to display on the map
  const initialRegion = {
    latitude: (restaurantCoords.latitude + companyCoords.latitude) / 2,
    longitude: (restaurantCoords.longitude + companyCoords.longitude) / 2,
    latitudeDelta: Math.abs(restaurantCoords.latitude - companyCoords.latitude) * 2 || 0.0922,
    longitudeDelta: Math.abs(restaurantCoords.longitude - companyCoords.longitude) * 2 || 0.0421,
  };

  const { createOrder } = useCartStore();

  return (
      <>
    <View style={tw`flex-1 bg-white mt-20`}>
      <ScrollView
        style={tw`flex-1 bg-white`}
        contentContainerStyle={tw`items-center`}
      >
        <MapView
          style={{ width: '100%', height: 250, marginBottom: 20 }}
          showsUserLocation={false}
          showsMyLocationButton={true}
        >
          <Marker
            coordinate={restaurantCoords}
            title="Restaurant"
            description="Your restaurant location"
          />
          <Marker
            coordinate={companyCoords}
            title="Company"
            description="Your company location"
          />
        </MapView>
        <CheckoutDetails restaurantId={restaurantId as string}/>
      </ScrollView>
      <View style={tw`absolute p-4 bottom-2`}>
        <SwipeToOrderButton createOrder={async () => createOrder(restaurantId as string)} />
      </View>
    </View>
    </>
  );
}
