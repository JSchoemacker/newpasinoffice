import React, { useRef, useEffect } from 'react';
import { Animated, Text } from 'react-native';

export default function AnimatedGoldName({ name }) {
  const colorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loopAnimation = () => {
      Animated.sequence([
        Animated.timing(colorAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(colorAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: false,
        }),
      ]).start(() => loopAnimation());
    };
    loopAnimation();
    return () => colorAnim.stopAnimation();
  }, [colorAnim]);

  const animatedColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFD700', '#FFB300'],
  });

  return (
    <Animated.Text
      style={{
        fontWeight: 'bold',
        fontSize: 16,
        color: animatedColor,
        marginLeft: 4,
        minWidth: 80,
      }}
      numberOfLines={1}
      ellipsizeMode="tail"
    >
      {name}
    </Animated.Text>
  );
}
