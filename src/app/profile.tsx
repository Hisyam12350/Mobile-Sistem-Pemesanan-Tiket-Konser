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
          <Image
            source={require('@/assets/images/splash-background.png')}
            style={styles.heroBackground}
            contentFit="cover"
          />

          <View style={styles.avatarContainer}>
            <Image
              source={require('@/assets/images/user-avatar.png')}
              style={styles.avatarImage}
              contentFit="cover"
            />
          </View>

          <Text style={styles.heroName}>{user?.username || 'User'}</Text>
          <Text style={styles.heroEmail}>{user?.email || 'User1234@gmail.com'}</Text>
        </View>

        {/* White Content Sheet */}
        <View style={styles.contentCard}>
          {/* Stats Summary Box */}
          <View style={styles.statsCard}>
            {stats.map((stat, index) => (
              <View key={stat.label + index} style={styles.statColumn}>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                {index < stats.length - 1 ? (
                  <View style={styles.statDivider} />
                ) : null}
              </View>
            ))}
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
