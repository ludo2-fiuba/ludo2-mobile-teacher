import React from 'react';
import { Modal, View, Text, FlatList, TouchableOpacity } from 'react-native';

const StudentSelectionModal: React.FC<StudentSelectionModalProps> = ({
  visible,
  students,
  onSelect,
  onClose
}) => {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, padding: 20 }}>
        <Text>Select a Student</Text>
        <FlatList
          data={students}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onSelect(item)}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity onPress={onClose}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default StudentSelectionModal;
