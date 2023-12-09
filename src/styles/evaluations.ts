import { Appearance, StyleSheet } from 'react-native';
import basic from './basic';
import { darkModeColors, lightModeColors } from './colorPalette';

export default function getStyleSheet() {
  return Appearance.getColorScheme() === 'dark' ? darkMode : lightMode;
}

const sharedStyle = StyleSheet.create({
  ...basic(),
  emptyEvaluationsContainer: {
    ...basic().view,
    flex: 1, // Ensure it covers the entire screen
    alignItems: 'center', // Center the content horizontally
    backgroundColor: 'white', // Set the background color to white
    padding: 15,
    borderRadius: 10,
  },
  emptyEvaluationsText: {
    ...basic().text,
    fontSize: 17,
    color: 'grey'
  },
});

const lightMode = StyleSheet.create({
  ...sharedStyle,
  view: {
    ...sharedStyle.view,
    backgroundColor: lightModeColors.mainColor,
  },
});

const darkMode = StyleSheet.create({
  ...sharedStyle,
  view: {
    ...sharedStyle.view,
    backgroundColor: darkModeColors.mainColor,
  },
});
