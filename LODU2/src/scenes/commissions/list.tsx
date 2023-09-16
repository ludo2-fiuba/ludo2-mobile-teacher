import React from 'react';
import AuthenticatedComponent from '../authenticatedComponent';
import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import {CommissionCard, Loading} from '../../components';
import {commissions as style} from '../../styles';
import {commissionRepository} from '../../repositories';

export default class CommissionsList extends AuthenticatedComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasDoneFirstLoad: false,
      loading: false,
      refreshing: false,
      commissions: [],
    };
  }

  componentDidMount() {
    this._focusUnsubscribe = this.props.navigation.addListener('focus', () => {
      this.fetchData(this.state.hasDoneFirstLoad);
    });
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
        commissions: [],
      });
    }
    this.request(() => commissionRepository.fetchAll())
      .then(async commissions => {
        if (refreshing) {
          this.setState({refreshing: false, commissions});
        } else {
          this.setState({loading: false, commissions});
        }
      })
      .catch(error => {
        if (refreshing) {
          this.setState({refreshing: false});
        } else {
          this.setState({loading: false});
        }
        Alert.alert(
          '¿Qué pasó?',
          'No sabemos pero no pudimos buscar tus comisiones. ' +
            'Volvé a intentar en unos minutos.',
        );
      });
  }

  render() {
    const {loading, refreshing, commissions, hasDoneFirstLoad} = this.state;
    const {navigation} = this.props;
    return (
      <View style={style().view}>
        {(loading || !hasDoneFirstLoad) && <Loading />}
        {hasDoneFirstLoad && !loading && !commissions.length && (
          <View style={style().containerView}>
            <Text style={style().text}>No tenés comisiones asignadas aún.</Text>
          </View>
        )}
        {hasDoneFirstLoad && !loading && (
          <FlatList
            contentContainerStyle={style().listView}
            data={commissions}
            onRefresh={() => this.fetchData(true)}
            refreshing={refreshing}
            keyExtractor={commission => commission.id.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('FinalsList', {
                    subject: item.subject.toObject(),
                  });
                }}>
                <CommissionCard commission={item} />
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  }
}
