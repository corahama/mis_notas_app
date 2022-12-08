//Base dependecies
import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, TextInput, Dimensions } from 'react-native';
import { IconButton, Text, TouchableRipple } from 'react-native-paper';
import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
//UI components
import { View } from '../components/Themed';
import { RootStackParamList } from '../types';

const screenHeight = Dimensions.get('window').height;

interface screenProps {
  navigation: NativeStackScreenProps<RootStackParamList>,
  route: NavigatorScreenParams<RootStackParamList>
}

export default function DetailScreen({ navigation, route }: screenProps) {
  const { editMode, access_token, note_id }: any = route.params;
  console.log(note_id);
  //State variables
  const [title, setTitle] = React.useState('');
  const [text, setText] = React.useState('');
  const [edit, setEdit] = React.useState(editMode);

  //Fetch note data
  const getDetailedNote = async () => {
    await fetch(`http://143.198.150.54/notes/${note_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
      },
    })
    .then(response => response.json())
    .then(data => {
      setTitle(data.title);
      setText(data.content);
    })
    .catch(error => console.log(error.message));
  }

  //Create note data
  const createNote = async () => {
    await fetch('http://143.198.150.54/notes/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
      },
      body: JSON.stringify({
        title: title,
        content: text,
      })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error.message));
  }

  //Update note data
  const updateNoteData = async () => {
    await fetch(`http://143.198.150.54/notes/${note_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
      },
      body: JSON.stringify({
        title: title,
        content: text,
      })
    })
    .then(response => response.json())
    .then(data => console.log('Edited response:', data))
    .catch(error => console.log(error.message));
  }

  const onModify = () => {
    setEdit(!edit);
    if (editMode) {
      createNote();
    } else {
      updateNoteData();
    }
  }

  React.useEffect(() => {
    getDetailedNote();
  }, [])

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Header edit={edit} navigation={navigation} />
      </SafeAreaView>
      <View style={styles.content}>
          <View style={styles.headlineContainer}>
            {
              !edit ? (
                <Text 
                  variant="headlineMedium" 
                  style={styles.headline}>
                    {title}
                </Text>
              ) : (
                <TextInput 
                  style={[styles.textInput, { 
                    marginVertical: 0, 
                    height: "auto" ,
                    fontSize: 26,
                    fontWeight: "800",
                  }]}
                  value={title}
                  placeholder="Título"
                  placeholderTextColor="#bbb"
                  editable={edit}
                  onChangeText={text => setTitle(text)}
                />
              )
            }
            <TouchableRipple
              style={{ borderRadius: 50 }}
              onPress={onModify}
              rippleColor="rgba(250, 250, 250, .1)"
            >
              <IconButton icon={!edit ? "pencil" : "check-bold"} size={30} iconColor="#fff" />
            </TouchableRipple>
          </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TextInput 
            style={styles.textInput}
            value={text}
            placeholder="Escribe aquí..."
            placeholderTextColor="#aaa"
            multiline
            editable={edit}
            onChangeText={text => setText(text)}
          />
        </ScrollView>
      </View>
    </View>
  );
}

function Header({ edit, navigation }: { edit: boolean, navigation: any }) {
  return(
    <View style={styles.header}>
      <IconButton 
        icon={!edit ? "arrow-left"  : "close"}
        size={40} 
        iconColor="#ccc"
        onPress={() => navigation.goBack()}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: "100%",
    flexDirection: "row",
  },
  headlineContainer: { 
    flexDirection: "row", 
    alignItems: "center",
    justifyContent: "space-between" 
  },
  headline: {
    fontWeight: "800",
  },
  content: {
    marginHorizontal: "5%"
  },
  textInput: {
    height: screenHeight,
    marginVertical: "5%",
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  }
});
