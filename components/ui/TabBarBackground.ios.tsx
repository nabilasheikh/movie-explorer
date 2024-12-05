import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet } from 'react-native';

const TabBarBackground = () => {
  return <BlurView intensity={100} style={StyleSheet.absoluteFill} />;
};

export default TabBarBackground;
