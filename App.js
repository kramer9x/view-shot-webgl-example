import React from 'react';
import { StyleSheet, Text, View, WebView, TouchableOpacity, Platform, PermissionsAndroid, InteractionManager } from 'react-native';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';

const source = Platform.select({
    'ios': require("./assets/index.html"),
    'android': { uri: 'file:///android_asset/index.html' }
});

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: new Date().toISOString(),
        }
    }
  onShare = async () => {
      if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.check(
              'android.permission.READ_EXTERNAL_STORAGE'
          );
          if (!granted) {
              const response = await PermissionsAndroid.request(
                  'android.permission.READ_EXTERNAL_STORAGE'
              );
              if (!response) {
                  return;
              }
          }
      }
      this.takeSnapshot();
  };

  takeSnapshot = () => {
      InteractionManager.runAfterInteractions(() => {
          this.container.capture().then(
              result => {
                  Share.open({
                      title: '',
                      message: '',
                      url: result,
                      subject: '',
                  }).catch(err => {
                      console.log('Share.open error', err);
                  });
              },
              error => console.error('Oops, snapshot failed', error)
          )
      });
  };

  onRefresh = () => {
        this.setState({
            key: new Date().toISOString()
        })
  };

  render() {

    return (
      <View
          style={styles.container}
      >
          <ViewShot
              ref={comp=> {
                  this.container = comp;
              }}
              options={{ format: "png", result: 'data-uri'}}
              style={{ flex: 1 }}
              collapsable={false}>
            <WebView
                key={this.state.key}
                javaScriptEnabled={true}
                style={{ flex: 1 }}
                source={source}
            />
          </ViewShot>
        <TouchableOpacity style={{ alignSelf: 'center', margin: 5, width: 200, height: 30, backgroundColor: "#079acb", borderRadius: 5, justifyContent: "center", alignItems: "center" }} onPress={this.onShare}>
            <Text style={{ color: 'white', fontSize: 17 }}>Share</Text>
        </TouchableOpacity>

          <TouchableOpacity style={{ alignSelf: 'center', margin: 5, width: 200, height: 30, backgroundColor: "#079acb", borderRadius: 5, justifyContent: "center", alignItems: "center" }} onPress={this.onRefresh}>
              <Text style={{ color: 'white', fontSize: 17 }}>Refresh</Text>
          </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 60,
    backgroundColor: 'white',
  },
});
