import { Appearance, StyleSheet } from 'react-native';
import basic from '../basic';
import { darkModeColors, lightModeColors } from '../colorPalette';

export default function getStyleSheet() {
  return Appearance.getColorScheme() === 'dark' ? darkMode : lightMode;
}

const sharedStyle = StyleSheet.create({
  ...basic(),
  view: {
    ...basic().view,
    alignItems: 'stretch',
    flex: 1,
  },
  textInput: {
    ...basic().textInput,
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  button: {
    ...basic().button,
    marginVertical: 15,
  },
});

const lightMode = StyleSheet.create({
  ...sharedStyle,
  button: {
    ...sharedStyle.button,
    backgroundColor: lightModeColors.mainColor,
  },
});

const darkMode = StyleSheet.create({
  ...sharedStyle,
  button: {
    ...sharedStyle.button,
    backgroundColor: darkModeColors.mainColor,
  },
});
