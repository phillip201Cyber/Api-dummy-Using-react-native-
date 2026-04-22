import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useSettings } from '@/src/context/settingpagecontext';
import { fontSizeMap, getAppColors } from '@/constants/theme';

export default function You() {
  const { settings } = useSettings();
  const colors = getAppColors(settings);
  const titleSize = (fontSizeMap[settings.fontSize] ?? fontSizeMap.md) + 8;
  const bodySize = fontSizeMap[settings.fontSize] ?? fontSizeMap.md;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text, fontSize: titleSize }]}>Profile</Text>
      <Text style={[styles.text, { color: colors.textMuted, fontSize: bodySize }]}>
        This page now reacts to the shared app settings.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontWeight: '700',
    marginBottom: 10,
  },
  text: {
    textAlign: 'center',
  },
});
