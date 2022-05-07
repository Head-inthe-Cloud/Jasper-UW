import React, {useState} from "react";
import { Image } from "react-native";
import AppLoading from "expo-app-loading";
import { useFonts } from '@use-expo/font';
import { Asset } from "expo-asset";
import { Block, GalioProvider } from "galio-framework";
import { NavigationContainer } from "@react-navigation/native";

// Before rendering any navigation stack
import { enableScreens } from "react-native-screens";
enableScreens();

import Screens from "./Screens";
import { Images, Theme } from "./constants";
import { items } from "./constants/mockData";

// cache app images
const assetImages = [
  Images.CherryBlossom,
  Images.Landing,
  Images.LogoLanding,
  Images.PaymentOptionLogos.PayPal,
  Images.PaymentOptionLogos.Venmo,
  Images.PaymentOptionLogos.WeChat,
  Images.PaymentOptionLogos.Zelle,
];

// cache product images
const itemList = Object.keys(items).map(key => items[key]);
itemList.map(item => item.images.map(image => assetImages.push(image)));

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default props => {
  const [isLoadingComplete, setLoading] = useState(false);
  let [fontsLoaded] = useFonts({
    'ArgonExtra': require('./assets/font/argon.ttf'),
  });

  function _loadResourcesAsync() {
    return Promise.all([...cacheImages(assetImages)]);
  }

  function _handleLoadingError(error) {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

 function _handleFinishLoading() {
    setLoading(true);
  };

  if(!fontsLoaded && !isLoadingComplete) {
    return (
      <AppLoading
        startAsync={_loadResourcesAsync}
        onError={_handleLoadingError}
        onFinish={_handleFinishLoading}
      />
    );
  } else if(fontsLoaded) {
    return (
      <NavigationContainer>
        <GalioProvider theme={Theme}>
          <Block flex >
            <Screens />
          </Block>
        </GalioProvider>
      </NavigationContainer>
    );
  } else {
    return null
  }
}