import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { evaluationGradesList as style } from '../../styles';
import React from 'react';

interface Props {
  showNotify: {
    show: boolean;
    enabled: boolean;
  };
  showSave: {
    show: boolean;
    enabled: boolean;
  };
  notifyGrades: () => void;
  saveChanges: (onSuccess?: any) => void;
}

export function SubmissionsHeaderRight({ showNotify, showSave, ...handlers }: Props) {
  const saveOpacityStyle = {
    ...style().navButton,
    opacity: showSave.enabled ? 1 : 0.5,
  };
  const notifyOpacityStyle = {
    ...style().navButton,
    opacity: showNotify.enabled ? 1 : 0.5,
  };

  return (
    <View style={style().navButtonsContainer}>
      {showNotify.show && (
        <TouchableOpacity
          style={notifyOpacityStyle}
          disabled={!showNotify.enabled}
          onPress={handlers.notifyGrades}>
          <Icon style={style().navButtonIcon} name="notifications" />
        </TouchableOpacity>
      )}

      {showSave.show && (
        <TouchableOpacity
          style={saveOpacityStyle}
          disabled={!showSave.enabled}
          onPress={() => handlers.saveChanges()}>
          <Icon style={style().navButtonIcon} name="save" />
        </TouchableOpacity>
      )}
    </View>
  );
}
