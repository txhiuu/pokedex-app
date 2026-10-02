import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');
const Bar_HEIGHT = 70;
const DoLonBtn = 56;

export default function TabBar() {
  const insets = useSafeAreaInsets();

  const [isOpen, setIsOpen] = useState(false);

  //Animation values
  const rotation = useSharedValue(0);
  const menuProgress = useSharedValue(0);

  const toggleMenu = () => {
    const next = !isOpen;
    setIsOpen(next);
    rotation.value = withSpring(next ? 45 : 0, { damping: 15 });
    menuProgress.value = withTiming(next ? 1 : 0, { duration: 250 });
  };

  //Style animation cho nút tròn trung tâm (xoay)
  const centerButtonStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  //Style animation cho icon tym ( left )
  const leftIconStyle = useAnimatedStyle(() => ({
    opacity: menuProgress.value,
    transform: [
      { translateX: -70 * menuProgress.value },
      { translateY: -60 * menuProgress.value },
      { scale: menuProgress.value },
    ],
  }));

  // Style animation cho icon camera ̣(right)
  const rightIconStyle = useAnimatedStyle(() => ({
    opacity: menuProgress.value,
    transform: [
      { translateX: 70 * menuProgress.value },
      { translateY: -60 * menuProgress.value },
      { scale: menuProgress.value },
    ],
  }));

  // SVG Path cho thanh cong
  const pathD = `
    M 0 0
    L ${width / 2 - 50} 0
    Q ${width / 2 - 25} 45, ${width / 2} 45
    Q ${width / 2 + 25} 45, ${width / 2 + 50} 0
    L ${width} 0
    L ${width} ${Bar_HEIGHT + insets.bottom}
    L 0 ${Bar_HEIGHT + insets.bottom}  
    Z
  `;

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: Bar_HEIGHT + 80 + insets.bottom,
        pointerEvents: 'box-none',
      }}
    >
      {/* Nền SVG cong */}
      <Svg
        width={width}
        height={Bar_HEIGHT + insets.bottom}
        style={{ position: 'absolute', bottom: 0 }}
      >
        <Path d={pathD} fill="#FFFFFF" />
      </Svg>

      {/*Nút Home*/}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 22 + insets.bottom,
          left: 45,
          alignItems: 'center',
        }}
        activeOpacity={0.7}
      >
        <Ionicons name="home" size={24} color="#1F2937" />
        <Text>Home</Text>
      </TouchableOpacity>

      {/*Nút Settings*/}
      <TouchableOpacity
        onPress={() => router.push('/settings')}
        style={{
          position: 'absolute',
          bottom: 22 + insets.bottom,
          right: 45,
          alignItems: 'center',
        }}
        activeOpacity={0.7}
      >
        <Ionicons name="settings-outline" size={24} color="#9CA3AF" />
        <Text>Setting</Text>
      </TouchableOpacity>

      {/* Icon tym (bay ra) */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: Bar_HEIGHT - 10,
            left: width / 2 - DoLonBtn / 2,
            width: DoLonBtn,
            height: DoLonBtn,
            borderRadius: DoLonBtn / 2,
            backgroundColor: '#EF4444',
            justifyContent: 'center',
            alignItems: 'center',
          },
          leftIconStyle,
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            toggleMenu();
            router.push('/favourite');
          }}
          style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
        >
          <Ionicons name="heart" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>

      {/* Icon camera (bay ra) */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: Bar_HEIGHT - 10,
            left: width / 2 - DoLonBtn / 2,
            width: DoLonBtn,
            height: DoLonBtn,
            borderRadius: DoLonBtn / 2,
            backgroundColor: '#5B4B8A',
            justifyContent: 'center',
            alignItems: 'center',
          },
          rightIconStyle,
        ]}
      >
        <Ionicons name="camera" size={24} color="white" />
      </Animated.View>

      {/* Nút tròn trung tâm */}
      <View
        style={{
          position: 'absolute',
          bottom: Bar_HEIGHT - DoLonBtn / 2 + 15,
          left: width / 2 - DoLonBtn / 2,
          width: DoLonBtn,
          height: DoLonBtn,
          borderRadius: DoLonBtn / 2,
          backgroundColor: '#8B7BC7',
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#5B4B8A',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <TouchableOpacity
          onPress={toggleMenu}
          style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
          activeOpacity={0.8}
        >
          <Animated.View style={centerButtonStyle}>
            <Ionicons name="add" size={32} color="white" />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
}