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
    paddingHorizontal: 10,
    paddingVertical: 3,
    flexDirection: 'row',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
  },
  studentInfo: {
    ...basic().view,
    alignItems: 'center',
    flexDirection: 'row',
  },
  gradeInfo: {
    alignItems: 'center',
    flexDirection: 'row-reverse',
  },
  name: {
    ...basic().text,
    fontSize: 15,
    marginStart: 8,
  },
  padron: {
    ...basic().text,
    fontSize: 25,
  },
  warning: {
    ...basic().text,
    fontSize: 25,
    marginHorizontal: 8,
  },
  grade: {
    ...basic().textInput,
    textAlign: 'center',
    width: 50,
  },
});

const lightMode = StyleSheet.create({
  ...sharedStyle,
  view: {
    ...sharedStyle.view,
    borderBottomColor: lightModeColors.lightGray,
  },
});

const darkMode = StyleSheet.create({
  ...sharedStyle,
  view: {
    ...sharedStyle.view,
    borderBottomColor: darkModeColors.lightGray,
  },
});
