import React, {Component} from 'react';
import {View, TextInput, Text, KeyboardType, ReturnKeyType} from 'react-native';
import validate from 'validate.js';

export interface FormInputProps {
  // Id
  ref?: (input: object) => void;
  // Content
  initialValue?: string;
  placeholder?: string;
  secure?: string;
  disabled?: boolean;
  // Style
  style?: object;
  placeholderColor: color;
  errorStyle?: object;
  keyboardType?: KeyboardType;
  returnKeyType?: ReturnKeyType;
  // Interaction
  nextField?: () => object;
  onTextChanged?: (newValue: string, isValid: boolean) => void;
  blurOnSubmit?: boolean;
  // Validation
  // Whether to show the error message when the user finishes editing or on every small edition.
  errorMessageOnEditFinish?: boolean;
  validation?: object;
}

export default class FormInput extends Component<FormInputProps> {
  public static defaultProps = {
    ref: null,
    initialValue: '',
    placeholder: '',
    secure: false,
    disabled: false,
    style: null,
    placeholderColor: 'white',
    errorStyle: null,
    keyboardType: 'default',
    returnKeyType: 'default',
    nextField: null,
    onTextChanged: null,
    blurOnSubmit: true,
    errorMessageOnEditFinish: true,
    validation: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.initialValue || '',
      error: props.initialValue ? this.validate(props.initialValue) : null,
    };
  }

  private onValueChanged(newValue: string) {
    this.setState({value: newValue});
  }

  focus() {
    this.textInput.focus();
  }

  isValid(): boolean {
    return !this.validate(this.state.value);
  }

  private validate(value: string): object {
    const formValues = {campo: value};
    const formFields = {campo: this.props.validation};
    const result = validate(formValues, formFields);
    let error = [];
    if (result && result.campo) {
      error = result.campo;
    }
    return error[0];
  }

  private checkValidity(value: string): string {
    const error = this.validate(value);
    this.setState({error});
  }

  render() {
    return (
      <View>
        <TextInput
          ref={input => {
            this.textInput = input;
          }}
          editable={!this.props.disabled}
          style={this.props.style}
          value={this.state.value}
          autoCapitalize="none"
          secureTextEntry={this.props.secure}
          keyboardType={this.props.keyboardType}
          returnKeyType={this.props.returnKeyType}
          onChangeText={text => {
            this.onValueChanged(text);
            if (!this.props.errorMessageOnEditFinish) {
              this.checkValidity(text);
            }
            if (this.props.onTextChanged) {
              this.props.onTextChanged(text, !this.validate(text));
            }
          }}
          onSubmitEditing={() => {
            if (this.props.nextField) {
              this.props.nextField().focus();
            }
          }}
          onBlur={() => {
            if (this.props.errorMessageOnEditFinish) {
              this.checkValidity(this.state.value);
            }
          }}
          blurOnSubmit={this.props.blurOnSubmit}
          placeholder={this.props.placeholder}
          placeholderTextColor={this.props.placeholderColor}
        />
        {this.state.error ? (
          <Text style={this.props.errorStyle}>{this.state.error}</Text>
        ) : null}
      </View>
    );
  }
}
