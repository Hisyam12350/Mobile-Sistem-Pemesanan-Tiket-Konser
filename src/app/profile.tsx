import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

import { profileStyles as styles } from '@/styles/profile/profileStyles';
import { useProfileController, MenuItem } from '@/controllers/profile/useProfileController';
import { BottomNav } from '@/components/bottom-nav';

export default function ProfileScreen() {
  const {
    user,
    stats,
    menuItems,
    handleLogout,
    handleMenuItemPress,
    handleBottomTabPress,
  } = useProfileController();

  const renderMenuIcon = (item: MenuItem) => {
    if (item.iconFamily === 'materialCommunity') {
      return (
        <MaterialCommunityIcons
          name={item.iconName as any}
          size={24}
          color="#000000"
        />
      );
    }
    return (
      <Ionicons
        name={item.iconName as any}
        size={24}
        color="#000000"
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroHeader}>
            <Text style={styles.heroTitle}>Profile</Text>
          </View>

          <View style={styles.avatarContainer}>
            <Image
              source={require('@/assets/images/user-avatar.png')}
              style={styles.avatarImage}
              contentFit="cover"
            />
          </View>

          <Text style={styles.heroName}>{user?.username || 'shasa'}</Text>
          <Text style={styles.heroEmail}>{user?.email || 'shasa@gmail.com'}</Text>
        </View>

        {/* White Content Sheet */}
        <View style={styles.contentCard}>
          {/* Stats Summary Box (Image 1 Mockup) */}
          <View style={styles.statsCard}>
            <View style={styles.statColumn}>
              <Text style={styles.statLabel}>Orders</Text>
              <Text style={styles.statValue}>{stats[0]?.value ?? 12}</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statColumn}>
              <Text style={styles.statLabel}>Orders</Text>
              <Text style={styles.statValue}>{stats[1]?.value ?? 24}</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statColumn}>
              <Text style={styles.statLabel}>Favorites</Text>
              <Text style={styles.statValue}>{stats[2]?.value ?? 8}</Text>
            </View>
          </View>

          {/* Menu Items List */}
          <View style={styles.menuList}>
            {menuItems.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuRow}
                onPress={() => handleMenuItemPress(item.label)}
                activeOpacity={0.7}
              >
                <View style={styles.menuIcon}>
                  {renderMenuIcon(item)}
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color="#333333"
                  style={styles.menuChevron}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Action */}
          <TouchableOpacity
            style={styles.logoutRow}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={styles.logoutIcon}>
              <MaterialCommunityIcons
                name="logout-variant"
                size={26}
                color="#E55353"
              />
            </View>
            <Text style={styles.logoutLabel}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* White Bottom Navigation Bar */}
      <BottomNav
        activeTab="Profile"
        variant="white"
        onTabPress={handleBottomTabPress as any}
      />
    </SafeAreaView>
  );
}
