import { Appearance, StyleSheet } from 'react-native';
import basic from './basic';
import { darkModeColors, lightModeColors } from './colorPalette';

export default function getStyleSheet() {
  return Appearance.getColorScheme() === 'dark' ? darkMode : lightMode;
}

const menuItem = {
  alignItems: 'center',
  justifyContent: 'center',
  width: 50,
  height: 50,
  borderRadius: 25,
};

const sharedStyle = StyleSheet.create({
  ...basic(),
  mainView: {
    ...basic().view,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  menuOpenerContainer: {
    ...menuItem,
    position: 'absolute',
    right: 30,
    bottom: 30,
  },
  menuSingleContainer: {
    ...menuItem,
    position: 'absolute',
    right: 30,
    bottom: 30,
  },
  menuOpener: menuItem,
  menu: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItem,
  menuRootItem: menuItem,
  itemIcon: {
    fontSize: 20,
    color: 'white',
  },
  itemText: {
    color: 'white',
  },
  filterButton: {
    ...menuItem,
  },
  filterButtonIcon: {
    fontSize: 20,
  },
});

const lightMode = StyleSheet.create({
  ...sharedStyle,
  menuOpener: {
    ...sharedStyle.menuOpener,
    backgroundColor: lightModeColors.menuOpener,
  },
  menuRootItem: {
    ...sharedStyle.menuRootItem,
    backgroundColor: lightModeColors.menuOpener,
  },
  menuItem: {
    ...sharedStyle.menuItem,
    backgroundColor: lightModeColors.menuOption,
  },
});

const darkMode = StyleSheet.create({
  ...sharedStyle,
  menuOpener: {
    ...sharedStyle.menuOpener,
    backgroundColor: darkModeColors.menuOpener,
  },
  menuRootItem: {
    ...sharedStyle.menuRootItem,
    backgroundColor: darkModeColors.menuOpener,
  },
  menuItem: {
    ...sharedStyle.menuItem,
    backgroundColor: darkModeColors.menuOption,
  },
});
