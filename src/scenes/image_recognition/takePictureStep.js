import React, { Component } from 'react';
import { Alert, SafeAreaView, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { takePicture as style } from '../../styles';
import TakePictureStepConfiguration from './takePictureStepConfiguration';
import TakePictureStepConfigurationFactory from './takePictureStepConfigurationFactory';

Icon.loadFont();

export default class TakePictureStep extends Component {
  constructor(props) {
    super(props);
    this.state = {loading: false};
    this.configuration = null;
  }

  async onBarCodeRead(scanResult) {
    if (this.state.loading) {
      return;
    }
    if (scanResult.data != null) {
      const {navigation} = this.props;
      this.setState({loading: true});
      const disableLoading = () => {
        this.setState({loading: false});
      };
      await this.getConfiguration().onDataObtained(
        scanResult.data,
        navigation,
        disableLoading,
      );
    }
  }

  getConfiguration() {
    if (this.configuration) {
      return this.configuration;
    }
    if (
      this.props.route &&
      this.props.route.params &&
      this.props.route.params.configuration
    ) {
      this.configuration = TakePictureStepConfigurationFactory.fromObject(
        this.props.route.params.configuration,
      );
    } else {
      this.configuration = this.props.configuration;
    }
    return this.configuration;
  }

  async takePicture(camera) {
    if (this.state.loading) {
      return;
    }
    if (camera) {
      this.setState({loading: true});
      const options = {
        width: 180,
        quality: 0.3,
        base64: true,
        forceUpOrientation: true,
        fixOrientation: true,
        doNotSave: true,
        orientation: 'portrait',
      };
      var base64;
      try {
        const data = await camera.takePictureAsync(options);
        base64 = data.base64;
      } catch (error) {
        this.setState({loading: false});
        Alert.alert('Hubo un error sacando la foto');
        return;
      }
      const {navigation} = this.props;
      const disableLoading = () => {
        this.setState({loading: false});
      };
      await this.getConfiguration().onDataObtained(
        base64,
        navigation,
        disableLoading,
      );
    }
  }

  render() {
    const configuration = this.getConfiguration();
    const {loading} = this.state;
    return (
      <View style={style().view}>
        <SafeAreaView style={style().view}>
          <Text style={style().text}>{configuration.description}</Text>
        </SafeAreaView>
      </View>
    );
  }
}

TakePictureStep.defaultProps = {
  configuration: new TakePictureStepConfiguration(),
};
