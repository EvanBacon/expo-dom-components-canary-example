import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, I18nManager } from 'react-native';
import { Avatar } from 'react-native-elements';
import LottieView from 'lottie-react-native';
import {
  User,
  CreditCard,
  FileText,
  Lock,
  Accessibility,
  Languages,
  MessageCircle,
  FileTerminal,
  Shield,
  Book,
  LogOut,
  ChevronLeft,
} from 'lucide-react-native';
import { useAuth } from '@/components/providers/auth-provider';
import LogoutButton from '@/components/native/profile/logout';

export default function Profile() {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);

  const { user } = useAuth();

  return (
      <SafeAreaView style={{ flex: 1 }}>
    <ScrollView style={styles.container} contentContainerStyle={{
        flexGrow: 1,
        direction: 'rtl',
        paddingBottom: 64,
        paddingTop: 16,
    }}>
      <TouchableOpacity style={styles.profileSection} onPress={() => {}}>
        <Avatar
          size={64}
          rounded
          title={`${user?.firstName[0]}${user?.lastName[0]}`}
          containerStyle={styles.avatar}
          titleStyle={{ fontSize: 32, color: 'white', fontFamily: 'fredoka-semibold' }}
        />
        <View>
          <Text style={styles.name}>{`${user.firstName} ${user.lastName}`}</Text>
          <Text style={styles.profileLink}>{`@${user.username}`}</Text>
        </View>
        <ChevronLeft size={24} color="gray" style={styles.chevron} />
      </TouchableOpacity>

      {/* Become a Food Partner Section */}
      <View style={styles.partnerSection}>
        <View style={styles.partnerText}>
            <Text style={styles.partnerTitle}>יחד ננצח!</Text>
    <Text style={styles.partnerDescription}>
      בואו נעמוד יחד ונבנה קהילה חזקה.
    </Text>
        </View>
        <LottieView
            source={require('@/assets/lottie/partner.json')}
            autoPlay
            loop
          style={styles.partnerImage}
        />
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>הגדרות</Text>
        <SettingsItem icon={User} label="מידע אישי" onPress={() => {}} />
        <SettingsItem
          icon={CreditCard}
          label="תשלומים"
          extraInfo="45.99$ לתשלום"
          onPress={() => {}}
        />
        <SettingsItem
          icon={FileText}
          label="היסטוריית הזמנות"
          extraInfo="12 החודש"
          onPress={() => {}}
        />
        <SettingsItem icon={Lock} label="כניסה ואבטחה" onPress={() => {}} />
        <SettingsItem
          icon={Accessibility}
          label="נגישות"
          onPress={() => {}}
        />
        <SettingsItem
          icon={Languages}
          label="שפה"
          onPress={() => {}}
        />
        <SettingsItem
          icon={MessageCircle}
          label="התראות"
          onPress={() => {}}
        />
      </View>

      {/* Legal Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>חוקי</Text>
        <SettingsItem
          icon={FileTerminal}
          label="תנאי שירות"
          onPress={() => {}}
        />
        <SettingsItem
          icon={Shield}
          label="מדיניות פרטיות"
          onPress={() => {}}
        />
        <SettingsItem
          icon={Book}
          label="רישיונות קוד פתוח"
          onPress={() => {}}
        />
      </View>

      <LogoutButton />
    </ScrollView>
    </SafeAreaView>
  );
}

interface SettingsItemProps {
    icon: React.ElementType;
    label: string;
    extraInfo?: string;
    onPress: () => void;
}

function SettingsItem({ icon: IconComponent, label, extraInfo, onPress }: SettingsItemProps) {
  return (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <View style={styles.settingsItemLeft}>
        <IconComponent size={24} color="gray" style={styles.settingsIcon} />
        <Text style={styles.settingsLabel}>{label}</Text>
      </View>
      <View style={styles.settingsItemRight}>
        {extraInfo && <Text style={styles.settingsExtraInfo}>{extraInfo}</Text>}
        <ChevronLeft size={24} color="gray" style={styles.chevron} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    marginLeft: 16,
  },
  // Profile Section Styles
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    width: '95%',
    alignSelf: 'center',
    borderBottomWidth: 1,
    paddingBottom: 8,
    borderBottomColor: '#e0e0e0',
  },
  avatar: {
    marginRight: 16,
    backgroundColor: '#fd8000',
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'fredoka-semibold',
    textAlign: 'left',
  },
  profileLink: {
    color: 'gray',
    fontFamily: 'fredoka',
    writingDirection: 'rtl',
  },
  chevron: {
    marginLeft: 'auto',
  },
  // Partner Section Styles
  partnerSection: {
    flexDirection: 'row',
    width: '95%',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  partnerText: {
    flex: 1,
  },
  partnerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    writingDirection: 'rtl',
    fontFamily: 'fredoka-semibold',
  },
  partnerDescription: {
      writingDirection: 'rtl',
      fontFamily: 'fredoka',
    color: 'gray',
  },
  partnerImage: {
    width: 80,
    height: 80,
    marginRight: 16,
    marginTop: -16,
  },
  // Section Styles
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'fredoka-semibold',
    marginBottom: 16,
    textAlign: 'left',
  },
  // Settings Item Styles
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsIcon: {
    marginRight: 16,
  },
  settingsLabel: {
    fontSize: 16,
    fontFamily: 'fredoka',
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsExtraInfo: {
    color: 'gray',
    fontFamily: 'fredoka',
    marginLeft: 8,
  },
  // Logout Button Styles
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#d9534f',
    borderRadius: 8,
    marginTop: 32,
    marginBottom: 32,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 20,
    fontFamily: 'fredoka-semibold',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
