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
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: 'grey',
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
