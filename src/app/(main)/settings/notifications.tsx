/**
 * Notification Settings Screen
 *
 * Manage notification preferences.
 *
 * @module app/(main)/settings/notifications
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, StyleSheet } from 'react-native';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useTheme } from '@/theme/hooks/useTheme';
import { Card } from '@/components/ui/Card';

export default function NotificationSettingsScreen(): React.ReactElement {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Card title={t('settings.notifications')}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>{t('settings.pushNotifications')}</Text>
            <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>Receive push notifications</Text>
          </View>
          <Switch value={pushEnabled} onValueChange={setPushEnabled} trackColor={{ false: colors.border, true: colors.primary[500] }} />
        </View>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>{t('settings.emailNotifications')}</Text>
            <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>Receive email notifications</Text>
          </View>
          <Switch value={emailEnabled} onValueChange={setEmailEnabled} trackColor={{ false: colors.border, true: colors.primary[500] }} />
        </View>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>{t('settings.notificationSound')}</Text>
            <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>Play sound for notifications</Text>
          </View>
          <Switch value={soundEnabled} onValueChange={setSoundEnabled} trackColor={{ false: colors.border, true: colors.primary[500] }} />
        </View>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>Vibration</Text>
            <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>Vibrate for notifications</Text>
          </View>
          <Switch value={vibrationEnabled} onValueChange={setVibrationEnabled} trackColor={{ false: colors.border, true: colors.primary[500] }} />
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  settingInfo: { flex: 1, marginRight: 12 },
  settingTitle: { fontSize: 16 },
  settingDesc: { fontSize: 13, marginTop: 2 },
});