import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { bottomNavStyles as styles } from '@/styles/shared/bottomNavStyles';

export type TabName = 'Home' | 'Search' | 'Tickets' | 'Profile';

interface BottomNavProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
  variant?: 'purple' | 'white';
}

export function BottomNav({ activeTab, onTabPress, variant = 'purple' }: BottomNavProps) {
  const isWhite = variant === 'white';

  const getColor = (tab: TabName) => {
    if (isWhite) {
      return activeTab === tab ? '#6F00FF' : '#111111';
    }
    return '#FFFFFF';
  };

  const getLabelStyle = (tab: TabName) => {
    if (isWhite) {
      return activeTab === tab ? styles.navLabelActiveWhite : styles.navLabelWhite;
    }
    return activeTab === tab ? styles.navLabelActive : styles.navLabel;
  };

  return (
    <View style={[styles.bottomNav, isWhite && styles.bottomNavWhite]}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onTabPress('Home')}
        activeOpacity={0.8}
      >
        <Ionicons
          name={activeTab === 'Home' ? 'home' : 'home-outline'}
          size={24}
          color={getColor('Home')}
        />
        <Text style={getLabelStyle('Home')}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onTabPress('Search')}
        activeOpacity={0.8}
      >
        <Ionicons
          name={activeTab === 'Search' ? 'search' : 'search-outline'}
          size={24}
          color={getColor('Search')}
        />
        <Text style={getLabelStyle('Search')}>Search</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onTabPress('Tickets')}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons
          name={
            activeTab === 'Tickets'
              ? 'ticket-confirmation'
              : 'ticket-confirmation-outline'
          }
          size={24}
          color={getColor('Tickets')}
        />
        <Text style={getLabelStyle('Tickets')}>Tickets</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onTabPress('Profile')}
        activeOpacity={0.8}
      >
        <Ionicons
          name={activeTab === 'Profile' ? 'person' : 'person-outline'}
          size={24}
          color={getColor('Profile')}
        />
        <Text style={getLabelStyle('Profile')}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}
