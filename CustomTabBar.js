import React from 'react';
import { View, TouchableOpacity, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import colors from './config/colors';

const { width } = Dimensions.get('window');

export default function CustomTabBar({ state, descriptors, navigation }) {
  const animatedValue = new Animated.Value(state.index);

  // Width of each tab
  const tabWidth = width / state.routes.length;

  // Animating the position of the circular active tab indicator
  const tabOffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, tabWidth],
  });

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: state.index,
      duration: 500,  // Slower animation (500ms)
      useNativeDriver: true,
    }).start();
  }, [state.index]);

  return (
    <View style={styles.tabContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const iconName =
            route.name === 'Home'
              ? 'home'
              : route.name === 'Auth'
              ? 'sign-in'
              : route.name === 'TakePicture'
              ? 'pagelines'
              : route.name === 'Community'
              ? 'comments'
              : route.name === 'Connect to the sensor'
              ? 'feed'
              : '';

          
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              key={index}
              onPress={onPress}
              style={styles.tabButton}
            >
              {/* Animated Circle for Icon and Label */}
              <Animated.View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: isFocused ? colors.primaryColor : 'transparent',  // Blue when active, transparent otherwise
                    transform: [{ scale: isFocused ? 1 : 0.8 }],  // Scale circle based on focus
                  },
                ]}
              >
                <FontAwesome
                  name={iconName}
                  size={isFocused ? 28 : 24}  // Larger icon for active tab
                  color={isFocused ? colors.white : colors.black}  // Highlight active tab icon
                />
                <Text style={[styles.label, { color: isFocused ? colors.white : colors.black, fontWeight: isFocused ? "bold": "normal"}]}>
                  {label}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.secondaryColor,
    width: '100%',
    height: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    paddingBottom: 10,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    textAlign:"center",
  },
  iconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 85,  // Adjust the size of the circle
    height: 85,  // Adjust the size of the circle
    borderRadius: 45,  // Ensure it's circular
  },
});
