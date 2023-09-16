// Tweaked from https://github.com/omulet/react-native-radial-menu

import React, {Component} from 'react';
import {Animated, PanResponder, View} from 'react-native';

const generateRadialPositions = (count, radius, spread_angle, start_angle) => {
  const span = spread_angle < 360 ? 1 : 0;
  const start = (start_angle * Math.PI) / 180;
  const rad = (spread_angle * Math.PI * 2) / 360 / (count - span);
  return [...Array(count)].map((_, i) => ({
    x: -Math.cos(start + rad * i) * radius,
    y: -Math.sin(start + rad * i) * radius,
  }));
};

export default class RadialMenu extends Component {
  constructor(props) {
    super(props);
    const children = React.Children.toArray(this.props.children);
    const initial_spots = generateRadialPositions(
      children.length - 1,
      this.props.menuRadius,
      this.props.spreadAngle,
      this.props.startAngle,
    );
    initial_spots.unshift({x: 0, y: 0});
    this.state = {
      item_spots: initial_spots,
      item_anims: initial_spots.map(
        (_, i) => new Animated.ValueXY({x: 0, y: 0}),
      ),
      selectedItem: null,
      childrenResponders: children.map((_, i) => this.createTapResponder(i)),
      children,
    };

    this.RMOpening = false;
  }

  componentDidMount() {
    if (this.props.opened) {
      this.openMenu();
    }
  }

  itemPanListener(e, gestureState) {
    let newSelected = null;
    if (!this.RMOpening) {
      newSelected = this.computeNewSelected(gestureState);
      if (this.state.selectedItem !== newSelected) {
        if (this.state.selectedItem !== null) {
          const restSpot = this.state.item_spots[this.state.selectedItem];
          Animated.spring(this.state.item_anims[this.state.selectedItem], {
            toValue: restSpot,
          }).start();
        }
        if (newSelected !== null && newSelected !== 0) {
          Animated.spring(this.state.item_anims[newSelected], {
            toValue: this.state.item_anims[0],
          }).start();
        }
        this.state.selectedItem = newSelected;
      }
    }
  }

  openMenu() {
    const {onOpen, onOpened} = this.props;
    const {item_spots, item_anims} = this.state;
    onOpen();
    this.RMOpening = true;
    Animated.stagger(
      20,
      item_spots.map((spot, idx) =>
        Animated.spring(item_anims[idx], {
          toValue: spot,
          friction: 6,
          tension: 80,
        }),
      ),
    ).start(_ => {
      onOpened();
    });
    // Make sure all items gets to initial position
    // before we start tracking them
    setTimeout(() => {
      this.RMOpening = false;
    }, 400);
  }

  releaseItem() {
    const {onClose, onClosed} = this.props;
    const {children, item_anims, selectedItem} = this.state;
    onClose();
    if (
      selectedItem &&
      !this.RMOpening &&
      'onSelect' in children[selectedItem].props
    ) {
      children[selectedItem].props.onSelect();
    }
    this.state.selectedItem = null;
    Animated.parallel(
      item_anims.map(item =>
        Animated.spring(item, {
          toValue: {x: 0, y: 0},
          friction: 10,
          tension: 60,
          restSpeedThreshold: 100,
          restDisplacementThreshold: 40,
        }),
      ),
    ).start(() => {
      onClosed();
    });
  }

  createPanResponder() {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        this.openMenu();
      },
      onPanResponderMove: (event, gestureState) => {
        const {item_anims} = this.state;
        return Animated.event(
          [null, {dx: item_anims[0].x, dy: item_anims[0].y}],
          {
            listener: (e, state) => {
              this.itemPanListener(e, state);
            },
          },
        )(event, gestureState);
      },
      onPanResponderRelease: () => {
        this.releaseItem();
      },
      onPanResponderTerminate: () => {
        this.releaseItem();
      },
    });
  }

  createTapResponder(childNumber) {
    if (childNumber === 0) {
      return this.createPanResponder();
    }
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        this.state.selectedItem = childNumber;
      },
      onPanResponderMove: () => {
        Animated.event([null, {dx: 0, dy: 0}]);
      },
      onPanResponderRelease: () => {
        this.releaseItem();
      },
      onPanResponderTerminate: () => {
        this.releaseItem();
      },
    });
  }

  computeNewSelected(gestureState) {
    const {dx, dy} = gestureState;
    let minDist = Infinity;
    let newSelected = null;
    const pointRadius = Math.sqrt(dx * dx + dy * dy);
    if (
      Math.abs(this.props.menuRadius - pointRadius) <
      this.props.menuRadius / 2
    ) {
      this.state.item_spots.forEach((spot, idx) => {
        const delta = {x: spot.x - dx, y: spot.y - dy};
        const dist = delta.x * delta.x + delta.y * delta.y;
        if (dist < minDist) {
          minDist = dist;
          newSelected = idx;
        }
      });
    }
    return newSelected;
  }

  render() {
    return (
      <View style={[this.props.style]}>
        {this.state.item_anims.map((_, i) => {
          const j = this.state.item_anims.length - i - 1;
          const handlers = this.state.childrenResponders[j].panHandlers;
          return (
            <Animated.View
              {...handlers}
              key={i}
              style={{
                transform: this.state.item_anims[j].getTranslateTransform(),
                position: 'absolute',
              }}>
              {this.state.children[j]}
            </Animated.View>
          );
        })}
      </View>
    );
  }
}

RadialMenu.defaultProps = {
  itemRadius: 30,
  menuRadius: 100,
  spreadAngle: 360,
  startAngle: 0,
  opened: false,
  onOpen: () => {},
  onOpened: () => {},
  onClose: () => {},
  onClosed: () => {},
};
