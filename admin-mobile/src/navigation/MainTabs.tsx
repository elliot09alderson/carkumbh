import { Pressable, StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ScanScreen } from '../screens/ScanScreen';
import { UsersScreen } from '../screens/UsersScreen';
import { ManualEntryScreen } from '../screens/ManualEntryScreen';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';
import { ZxLogo } from '../components/ZxLogo';

export type MainTabParamList = {
  Scan: undefined;
  Users: undefined;
  Manual: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function HeaderTitle() {
  return (
    <View style={styles.headerMark}>
      <ZxLogo size={28} />
    </View>
  );
}

function HeaderSignOut() {
  const { logout } = useAuth();
  return (
    <Pressable onPress={() => logout()} hitSlop={12} style={styles.signOutWrap}>
      <Text style={styles.signOut}>Sign out</Text>
    </Pressable>
  );
}

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: () => <HeaderTitle />,
        headerRight: () => <HeaderSignOut />,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: colors.bg,
        },
        headerTintColor: colors.text,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.surface,
          paddingBottom: 6,
          paddingTop: 6,
          height: 62,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'qr-code' : 'qr-code-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Users"
        component={UsersScreen}
        options={{
          title: 'Guests',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person-circle' : 'person-circle-outline'} size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Manual"
        component={ManualEntryScreen}
        options={{
          title: 'Manual',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'ticket' : 'ticket-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerMark: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  signOutWrap: {
    marginRight: 8,
  },
  signOut: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '500',
  },
});
