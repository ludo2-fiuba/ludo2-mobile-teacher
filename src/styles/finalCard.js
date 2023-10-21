import { Appearance, StyleSheet } from 'react-native';
import basic from './basic';
import { darkModeColors, lightModeColors } from './colorPalette';

export default function getStyleSheet() {
  return Appearance.getColorScheme() === 'dark' ? darkMode : lightMode;
}

const sharedStyle = StyleSheet.create({
  ...basic(),
  view: {
    ...basic().view,
    alignItems: 'stretch',
    flex: 1,
    justifyContent: 'space-between',
    marginVertical: 10,
    marginHorizontal: 20,
    padding: 15,
  },
  date: {
    ...basic().text,
    fontSize: 25,
  },
  hour: {
    ...basic().text,
    fontSize: 20,
    paddingVertical: 5,
  },
  status: {
    ...basic().text,
    fontSize: 13,
  },
});

const lightMode = StyleSheet.create({
  ...sharedStyle,
  view: {
    ...sharedStyle.view,
    backgroundColor: lightModeColors.mainColor,
  },
  hour: {
    ...sharedStyle.hour,
    color: lightModeColors.mainContrastColor,
  },

  status: {
    ...sharedStyle.status,
    color: lightModeColors.mainContrastColor,
  },

  date: {
    ...sharedStyle.date,
    color: lightModeColors.mainContrastColor,
  },
});

const darkMode = StyleSheet.create({
  ...sharedStyle,
  view: {
    ...sharedStyle.view,
    backgroundColor: darkModeColors.mainColor,
  },
  hour: {
    ...sharedStyle.hour,
    color: darkModeColors.mainContrastColor,
  },

  status: {
    ...sharedStyle.status,
    color: darkModeColors.mainContrastColor,
  },

  date: {
    ...sharedStyle.date,
    color: darkModeColors.mainContrastColor,
  },
});
