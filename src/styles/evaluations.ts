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
    alignItems: 'stretch',
    flex: 1,
    justifyContent: 'space-between',
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 10
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
  // evaluationName: {
  //   ...sharedStyle.evaluationName,
  //   color: lightModeColors.mainContrastColor,
  // },
  // startDate: {
  //   ...sharedStyle.startDate,
  //   color: lightModeColors.mainContrastColor,
  // },

  // date: {
  //   ...sharedStyle.date,
  //   color: lightModeColors.mainContrastColor,
  // },
});

const darkMode = StyleSheet.create({
  ...sharedStyle,
  view: {
    ...sharedStyle.view,
    backgroundColor: darkModeColors.mainColor,
  },
  // evaluationName: {
  //   ...sharedStyle.evaluationName,
  //   color: darkModeColors.mainContrastColor,
  // },
  // startDate: {
  //   ...sharedStyle.startDate,
  //   color: darkModeColors.mainContrastColor,
  // },

  // date: {
  //   ...sharedStyle.date,
  //   color: darkModeColors.mainContrastColor,
  // },
});
