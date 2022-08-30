import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import RNFS from 'react-native-fs';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const HomeScreen = () => {
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const runTest = async () => {
    RNFS.readDir(RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
      .then(result => {
        console.log('GOT RESULT', result);

        return Promise.all([RNFS.stat(result[0].path), result[0].path]);
      })
      .then(statResult => {
        if (statResult[0].isFile()) {
          // if we have a file, read it
          return RNFS.readFile(statResult[1], 'utf8');
        }
        return 'no file';
      })
      .then(contents => {
        // log the file contentsh
        console.log(contents);
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const deletePath = async () => {
    const path = RNFS.DocumentDirectoryPath + '/text.xml';
    RNFS.unlink(path)
      .then(() => {
        console.log('FILE DELETED');
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const createfile = async () => {
    const path = RNFS.DocumentDirectoryPath + '/text.xml';
    RNFS.exists(path).then(exists => {
      if (exists) {
        Alert.alert('Path is exists');
      } else {
        RNFS.writeFile(path, title + '  ' + image, 'utf8')
          .then(success => {
            console.log('FILE WRITTEN!');
            runTest();
            clearButton();
          })
          .catch(err => {
            console.log(err.message);
          });
      }
    });
  };

  const checkfile = async () => {
    const path = RNFS.DocumentDirectoryPath + '/text.xml';
    RNFS.exists(path).then(exists => {
      if (exists) {
        Alert.alert('Path is exists');
      } else {
        Alert.alert('Path is not exists');
      }
    });
  };

  const openLibrary = () => {
    const options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, response => {
      setImage(response.assets[0].uri);
    });
  };

  const clearButton = () => {
    setImage('');
    setTitle('');
  };

  return (
    <View style={{flex: 1}}>
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          height: 40,
          backgroundColor: '#4ce0a8',
          // marginTop: 24,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={styles.textbutton}>Choose</Text>
      </View>
      <View style={{}}>
        <TextInput
          placeholder="Title"
          style={{height: (height - 40 - 24 - 50) * 0.3}}
          value={title}
          onChangeText={setTitle}
        />
      </View>
      <View style={{height: (height - 40 - 24 - 50) * 0.7}}>
        <Pressable
          style={{
            backgroundColor: 'blue',
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => openLibrary()}>
          <Text style={{fontSize: 16, color: 'white', fontWeight: '700'}}>
            Choose Picture
          </Text>
        </Pressable>
        {image && <Image source={{uri: image}} style={{flex: 1 / 2}} />}
      </View>
      <View style={{height: 50, flexDirection: 'row'}}>
        <Pressable
          style={{
            width: width / 3,
            backgroundColor: '#d9cd71',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => checkfile()}>
          <Text style={styles.textbutton}>Check</Text>
        </Pressable>
        <Pressable
          style={{
            width: width / 3,
            backgroundColor: '#c9de71',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => createfile()}>
          <Text style={styles.textbutton}>Create</Text>
        </Pressable>
        <Pressable
          style={{
            backgroundColor: '#d4de41',
            alignItems: 'center',
            width: width / 3,
            justifyContent: 'center',
          }}
          onPress={() => deletePath()}>
          <Text style={styles.textbutton}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textbutton: {
    fontSize: 16,
    color: 'white',
    fontWeight: '700',
  },
});

export default HomeScreen;
