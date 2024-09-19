import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Linking, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

export default function ConnectToSensor() {
  const [isLoading, setIsLoading] = useState(false);
  const { height } = Dimensions.get('window');  // Get screen height dynamically

  const handleOpenWiFiSettings = () => {
    // Open the Wi-Fi settings for the user to manually connect to NodeMCU
    Linking.openURL('App-Prefs:root=WIFI');  // For iOS. On Android, this will open WiFi settings by default
  };

  const handleLoadNodeMCUPage = () => {
    setIsLoading(true);
  };

  return (
    <View style={styles.container}>
      {!isLoading && (
        <>
          <Text style={styles.instructions}>
            Please connect to the NodeMCU's Wi-Fi network manually, then come back to this app.
          </Text>
          <Button title="Open Wi-Fi Settings" onPress={handleOpenWiFiSettings} />

          <Text style={styles.instructions}>
            Once you're connected to the NodeMCU, click the button below to configure the sensor.
          </Text>

          <Button
            title="Load NodeMCU Setup Page"
            onPress={handleLoadNodeMCUPage}
          />
        </>
      )}

      {isLoading && (
        <WebView
          source={{ uri: 'http://192.168.4.1' }}  // NodeMCU's default local IP for Wi-Fi configuration
          style={{ height: height * 0.8, width: '100%' }}  // Adjusted height and full width
          startInLoadingState={true}
          renderLoading={() => <ActivityIndicator size="large" color="#44b39d" />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
});
