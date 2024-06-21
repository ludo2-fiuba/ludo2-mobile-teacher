import { Appearance, StyleSheet } from 'react-native';
import { darkModeColors, lightModeColors } from './colorPalette';

export default function getStyleSheet() {
  return Appearance.getColorScheme() === 'dark' ? darkMode : lightMode;
}

const sharedStyle = StyleSheet.create({
  view: {
    flex: 1,
    flexDirection: 'column',
  },
  containerView: {
    flex: 1,
    padding: 15,
  },
  listView: {
    alignItems: 'stretch',
    paddingVertical: 5,
  },
  listHeaderFooter: {
    margin: 15,
  },
  scrollView: {
    flexGrow: 1,
    alignItems: 'stretch',
    justifyContent: 'space-between',
    padding: 15,
  },
  text: {
    fontSize: 15,
    fontFamily: 'HelveticaNeue',
  },
  button: {
    fontSize: 15,
    fontWeight: 'bold',
    height: 50,
    borderRadius: 25,
    fontFamily: 'HelveticaNeue',
  },
  textInput: {
    fontSize: 15,
    height: 50,
    borderWidth: 2,
    fontFamily: 'HelveticaNeue',
  },
  textInputPlaceholder: {
    fontFamily: 'HelveticaNeue',
  },
  errorInInput: {
    fontSize: 13,
    fontFamily: 'HelveticaNeue',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  navButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  navButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonIcon: {
    fontSize: 20,
  },
  dateButtonInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: 'transparent',
    borderRadius: 5,
    display: 'flex',
    textAlign: 'center',
  }
});

const lightViewColors = {
  backgroundColor: 'white',
  tintColor: lightModeColors.mainContrastColor,
  color: lightModeColors.mainColor,
};

const lightMode = StyleSheet.create({
  ...sharedStyle,
  view: {
    ...sharedStyle.view,
    ...lightViewColors,
  },
  containerView: {
    ...sharedStyle.containerView,
    ...lightViewColors,
  },
  listView: {
    ...sharedStyle.listView,
    ...lightViewColors,
  },
  scrollView: {
    ...sharedStyle.scrollView,
    ...lightViewColors,
  },
  text: {
    ...sharedStyle.text,
    color: lightModeColors.mainContrastColor,
  },
  button: {
    ...sharedStyle.button,
    backgroundColor: lightModeColors.secondaryColor,
    tintColor: lightModeColors.secondaryContrastColor,
  },
  textInput: {
    ...sharedStyle.textInput,
    borderColor: lightModeColors.mainColor,
    color: lightModeColors.mainContrastColor,
  },
  textInputPlaceholder: {
    ...sharedStyle.textInputPlaceholder,
    color: lightModeColors.darkGray,
  },
  errorInInput: {
    ...sharedStyle.errorInInput,
    color: 'red',
  },
  loading: {
    ...sharedStyle.loading,
    color: lightModeColors.darkGray,
  },
});

const darkViewColors = {
  backgroundColor: 'black',
  tintColor: darkModeColors.mainContrastColor,
  color: darkModeColors.mainColor,
};

const darkMode = StyleSheet.create({
  ...sharedStyle,
  view: {
    ...sharedStyle.view,
    ...darkViewColors,
  },
  containerView: {
    ...sharedStyle.containerView,
    ...darkViewColors,
  },
  listView: {
    ...sharedStyle.listView,
    ...darkViewColors,
  },
  scrollView: {
    ...sharedStyle.scrollView,
    ...darkViewColors,
  },
  text: {
    ...sharedStyle.text,
    color: darkModeColors.mainContrastColor,
  },
  button: {
    ...sharedStyle.button,
    backgroundColor: darkModeColors.secondaryColor,
    tintColor: darkModeColors.secondaryContrastColor,
  },
  textInput: {
    ...sharedStyle.textInput,
    borderColor: darkModeColors.mainColor,
    color: darkModeColors.mainContrastColor,
  },
  textInputPlaceholder: {
    ...sharedStyle.textInputPlaceholder,
    color: darkModeColors.lightGray,
  },
  errorInInput: {
    ...sharedStyle.errorInInput,
    color: 'red',
  },
  loading: {
    ...sharedStyle.loading,
    color: darkModeColors.lightGray,
  },
});
