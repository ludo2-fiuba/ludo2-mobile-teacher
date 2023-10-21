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
    marginHorizontal: 10,
    padding: 15,
  },
  name: {
    ...basic().text,
    fontSize: 25,
  },
  status: {
    ...basic().text,
    fontSize: 20,
    paddingVertical: 5,
  },
  date: {
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
  name: {
    ...sharedStyle.name,
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
  name: {
    ...sharedStyle.name,
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
