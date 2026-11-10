import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Modal, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';


const { width } = Dimensions.get('window');
const Bar_HEIGHT = 70;
const DoLonBtn = 56;

export default function TabBar() {

  const [isIdentifying, setIsIdentifying] = useState(false);

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

  const handleCameraPress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Quyền truy cập bị từ chối", "Bạn cần cấp quyền truy cập thư viện ảnh để sử dụng tính năng này.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (pickerResult.canceled || !pickerResult.assets[0].base64) {
      return;
    }
    toggleMenu();
    setIsIdentifying(true);

    try {

      const API_URL = 'http://192.168.16.106:3000/api/identify';

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: `data:image/jpeg;base64,${pickerResult.assets[0].base64}`
        }),
      });

      const data = await response.json();

      if (data.success && data.pokemonName !== 'unknown') {
        router.push(`/details?name=${data.pokemonName}`);
      } else {
        Alert.alert("Không tìm thấy Pokemon", "AI không thể nhận diện được Pokemon trong bức ảnh này. Vui lòng thử lại với ảnh khác rõ hơn.");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Lỗi kết nối", "Không thể kết nối tới Server. Hãy kiểm tra lại IP và đảm bảo điện thoại và máy tính dùng chung Wi-Fi.");
    } finally {
      setIsIdentifying(false);
    }
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

  const { theme, isDark } = useTheme();

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
        <Path d={pathD} fill={theme.surface} />
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
        <Ionicons name="home" size={24} color={theme.textPrimary} />
        <Text style={{ color: theme.textSecondary }}>Home</Text>
      </TouchableOpacity>

      {/*Nút Settings*/}
      <TouchableOpacity
        onPress={() => {
          Haptics.selectionAsync();
          router.push('/settings');
        }}
        style={{
          position: 'absolute',
          bottom: 22 + insets.bottom,
          right: 45,
          alignItems: 'center',
        }}
        activeOpacity={0.7}
      >
        <Ionicons name="settings-outline" size={24} color={theme.textSecondary} />
        <Text style={{ color: theme.textSecondary }}>Settings</Text>
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

        <TouchableOpacity
          onPress={handleCameraPress}
          style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
        >
          <Ionicons name="camera" size={24} color="white" />
        </TouchableOpacity>
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
          backgroundColor: isDark ? '#A78BFA' : '#8B7BC7',
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
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            toggleMenu();
          }}
          style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
          activeOpacity={0.8}
        >
          <Animated.View style={centerButtonStyle}>
            <Ionicons name="add" size={32} color="white" />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Loading Overlay khi AI đang nhận diện */}
      <Modal visible={isIdentifying} transparent={true} animationType="fade">
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.7)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: '#1E1B3A', 
            padding: 30,
            borderRadius: 20,
            alignItems: 'center',
            gap: 15
          }}>
            <ActivityIndicator size="large" color="#A78BFA" />
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
              AI đang nhận diện Pokemon...
            </Text>
            <Text style={{ color: '#A1A1B5', fontSize: 13 }}>
              Vui lòng chờ trong giây lát
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}