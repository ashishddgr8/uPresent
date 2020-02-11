import React from 'react';
import {
  Alert,
  AsyncStorage,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {TextField} from 'react-native-material-textfield';
import {RaisedTextButton} from 'react-native-material-buttons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export class Register extends React.Component {
  constructor(props) {
    super(props);

    this.onFocus = this.onFocus.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmitUsername = this.onSubmitUsername.bind(this);
    this.onSubmitPassword = this.onSubmitPassword.bind(this);
    this.onSubmitPasswordConfirm = this.onSubmitPasswordConfirm.bind(this);
    this.onAccessoryPress = this.onAccessoryPress.bind(this);

    this.usernameRef = this.updateRef.bind(this, 'username');
    this.passwordRef = this.updateRef.bind(this, 'password');
    this.passwordConfirmRef = this.updateRef.bind(this, 'passwordConfirm');

    this.renderPasswordAccessory = this.renderPasswordAccessory.bind(this);

    this.state = {
      username: '',
      password: '',
      passwordConfirm: '',
      secureTextEntry: true,
    };
  }

  onFocus() {
    let {errors = {}} = this.state;
    for (let name in errors) {
      let ref = this[name];
      if (ref && ref.isFocused()) {
        delete errors[name];
      }
    }

    this.setState({errors});
  }

  onChangeText(text) {
    ['username', 'password', 'passwordConfirm']
      .map(name => ({name, ref: this[name]}))
      .forEach(({name, ref}) => {
        if (ref.isFocused()) {
          this.setState({[name]: text});
        }
      });
  }

  onSubmitUsername() {
    this.email.focus();
  }

  onSubmitPassword() {
    this.msg.focus();
  }

  onSubmitPasswordConfirm() {
    this.msg.blue();
  }

  onSubmit() {
    let errors = {};

    ['username', 'password', 'passwordConfirm'].forEach(name => {
      let value = this[name].value();

      if (!value) {
        errors[name] = 'Should not be empty';
      }
    });

    if (this['password'].value() !== this['passwordConfirm'].value()) {
      errors['passwordConfirm'] = 'Passwords do not match';
    } else {
      AsyncStorage.getItem(this['username'].value(), (err, result) => {
        if (result !== null) {
          errors['username'] =
            'An account with the same username alread exists';
        }
      });
    }

    this.setState({errors});

    if (Object.entries(errors).length === 0 && errors.constructor === Object) {
      AsyncStorage.setItem(
        this['username'].value(),
        this['password'].value(),
        () => {
          Alert.alert('Account created');
          this.props.navigation.navigate('HomeRT');
        },
      );
    }
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  renderPasswordAccessory() {
    let {secureTextEntry} = this.state;
    let name = secureTextEntry ? 'visibility' : 'visibility-off';

    return (
      <MaterialIcon
        size={24}
        name={name}
        color={TextField.defaultProps.baseColor}
        onPress={this.onAccessoryPress}
        suppressHighlighting={true}
      />
    );
  }

  onAccessoryPress() {
    this.setState(({secureTextEntry}) => ({
      secureTextEntry: !secureTextEntry,
    }));
  }

  cancelRegister = () => {
    Alert.alert('Registration cancelled');
    this.props.navigation.navigate('HomeRT');
  };

  render() {
    let {errors = {}, secureTextEntry, ...data} = this.state;
    let {username, password, passwordConfirm} = data;

    return (
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Text style={styles.heading}>Register</Text>
            <TextField
              ref={this.usernameRef}
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitUsername}
              returnKeyType="next"
              label="Username"
              error={errors.username}
            />
            <TextField
              ref={this.passwordRef}
              secureTextEntry={secureTextEntry}
              autoCapitalize="none"
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              clearTextOnFocus={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitPassword}
              returnKeyType="next"
              label="Password"
              error={errors.password}
              maxLength={15}
              renderRightAccessory={this.renderPasswordAccessory}
            />
            <TextField
              ref={this.passwordConfirmRef}
              secureTextEntry={secureTextEntry}
              autoCapitalize="none"
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              clearTextOnFocus={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitPasswordConfirm}
              returnKeyType="done"
              label="Confirm Password"
              error={errors.passwordConfirm}
              maxLength={15}
              renderRightAccessory={this.renderPasswordAccessory}
            />
          </View>
          <View style={styles.buttonContainer}>
            <RaisedTextButton
              onPress={this.onSubmit}
              title="Register"
              color={TextField.defaultProps.tintColor}
              titleColor="white"
            />
            <RaisedTextButton
              onPress={this.cancelRegister}
              title="Cancel"
              color={TextField.defaultProps.tintColor}
              titleColor="white"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = {
  scroll: {
    backgroundColor: 'transparent',
  },
  container: {
    margin: 8,
    marginTop: Platform.select({ios: 8, android: 32}),
    flex: 1,
  },
  contentContainer: {
    padding: 8,
  },
  buttonContainer: {
    paddingTop: 8,
    margin: 8,
  },
  safeContainer: {
    flex: 1,
    backgroundColor: '#E8EAF6',
  },
};