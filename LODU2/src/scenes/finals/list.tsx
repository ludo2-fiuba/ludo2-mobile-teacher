import React from 'react';
import AuthenticatedComponent from '../authenticatedComponent';
import {View, Text, FlatList, Alert, TouchableOpacity} from 'react-native';
import {FinalCard, Loading, RoundedButton} from '../../components';
import {getStyleSheet as style} from '../../styles';
import {finalRepository} from '../../repositories';
import {FinalStatus, Subject} from '../../models';

export default class FinalsList extends AuthenticatedComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasDoneFirstLoad: false,
      loading: false,
      refreshing: false,
      finals: [],
    };
    this.subject = null;
  }

  componentDidMount() {
    this._focusUnsubscribe = this.props.navigation.addListener('focus', () => {
      this.fetchData(this.state.hasDoneFirstLoad);
    });
  }

  componentWillUnmount() {
    this._focusUnsubscribe();
  }

  getSubject() {
    if (this.subject) {
      return this.subject;
    }
    if (
      this.props.route &&
      this.props.route.params &&
      this.props.route.params.subject
    ) {
      this.subject = Subject.fromObject(this.props.route.params.subject);
    } else {
      this.subject = this.props.subject;
    }
    return this.subject;
  }

  fetchData(refreshing: boolean = false) {
    if (this.state.loading || this.state.refreshing) {
      return;
    }
    if (refreshing) {
      this.setState({
        refreshing: true,
        hasDoneFirstLoad: true,
      });
    } else {
      this.setState({
        loading: true,
        hasDoneFirstLoad: true,
        finals: [],
      });
    }
    this.request(() => finalRepository.fetchFromSubject(this.getSubject().id))
      .then(async finals => {
        // Newest first
        const orderedFinals = finals.sort((a, b) => {
          if (a.date == b.date) {
            return 0;
          }
          if (a.date < b.date) {
            return 1;
          }
          return -1;
        });
        if (refreshing) {
          this.setState({refreshing: false, finals: orderedFinals});
        } else {
          this.setState({loading: false, finals: orderedFinals});
        }
      })
      .catch(error => {
        if (refreshing) {
          this.setState({refreshing: false});
        } else {
          this.setState({loading: false});
        }

        Alert.alert(
          'Te fallamos',
          'No pudimos encontrar los finales de esta materia. ' +
            'Volvé a intentar en unos minutos.',
        );
        this.props.navigation.pop();
      });
  }

  render() {
    const {loading, refreshing, finals, hasDoneFirstLoad} = this.state;
    const {navigation} = this.props;
    return (
      <View style={style().view}>
        {(loading || !hasDoneFirstLoad) && <Loading />}
        {hasDoneFirstLoad && !loading && !finals.length && (
          <View style={style().containerView}>
            <RoundedButton
              text="Agregar final"
              style={style().button}
              onPress={() => {
                navigation.navigate('FinalDateTimePicker', {
                  subject: this.getSubject().toObject(),
                });
              }}
            />
            <Text style={style().text}>
              Esta comisión no tiene finales aún.
            </Text>
          </View>
        )}
        {hasDoneFirstLoad && !loading && !!finals.length && (
          <FlatList
            contentContainerStyle={style().listView}
            data={finals}
            onRefresh={() => this.fetchData(true)}
            refreshing={refreshing}
            keyExtractor={final => final.id.toString()}
            ListHeaderComponent={() => {
              return (
                <RoundedButton
                  text="Agregar final"
                  style={{...style().button, ...style().listHeaderFooter}}
                  onPress={() => {
                    navigation.navigate('FinalDateTimePicker', {
                      subject: this.getSubject().toObject(),
                    });
                  }}
                />
              );
            }}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => {
                  if (
                    item.currentStatus() == FinalStatus.Draft ||
                    item.currentStatus() == FinalStatus.Rejected
                  ) {
                    return;
                  }
                  if (item.currentStatus() == FinalStatus.Future) {
                    Alert.alert('Bajá esa ansiedad, todavía falta.');
                  } else if (item.currentStatus() == FinalStatus.Closed) {
                    navigation.navigate('FinalExamsList', {
                      final: item.toObject(),
                      editable: false,
                    });
                  } else if (item.currentStatus() == FinalStatus.Grading) {
                    navigation.navigate('FinalExamsList', {
                      final: item.toObject(),
                    });
                  } else {
                    navigation.navigate('QR', {
                      final: item.toObject(),
                    });
                  }
                }}>
                <FinalCard final={item} />
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  }
}
