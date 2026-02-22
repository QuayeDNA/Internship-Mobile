import { Tabs } from 'expo-router';
import { ClipboardList, LayoutDashboard, UserCheck, UserCircle } from 'lucide-react-native';
import React from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';

export default function AppLayout() {
  const theme = useTheme();
  const indicatorX = React.useRef(new Animated.Value(0)).current;

  const TabBar = ({ state, descriptors, navigation }: any) => {
    const focusedIndex = state.index;
    React.useEffect(() => {
      Animated.timing(indicatorX, {
        toValue: focusedIndex * (100 / state.routes.length),
        duration: 250,
        useNativeDriver: true,
      }).start();
    }, [focusedIndex]);

    const width = `${100 / state.routes.length}%` as unknown as number | `${number}%`;

    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
        }}
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const isFocused = state.index === index;
          let IconComponent: any;
          if (route.name === 'index') IconComponent = LayoutDashboard;
          else if (route.name === 'register-internship') IconComponent = ClipboardList;
          else if (route.name === 'assignment') IconComponent = UserCheck;
          else if (route.name === 'profile') IconComponent = UserCircle;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={label}
              onPress={onPress}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            >
              <IconComponent
                color={isFocused ? theme.colors.primary : theme.colors.textSecondary}
                size={24}
              />
              <Text
                style={{
                  ...theme.typography.caption,
                  color: isFocused ? theme.colors.primary : theme.colors.textSecondary,
                  marginTop: 4,
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width,
            height: 3,
            backgroundColor: theme.colors.accent,
            transform: [{ translateX: indicatorX.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }) }],
          }}
        />
      </View>
    );
  };

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={({ route }) => ({
        headerShown: false,
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="register-internship" options={{ title: 'Internship' }} />
      <Tabs.Screen name="assignment" options={{ title: 'Assignment' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="help" options={{ title: 'Help' }} />
    </Tabs>
  );
}
