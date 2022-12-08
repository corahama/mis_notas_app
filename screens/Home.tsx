// Base dependecies
import React from 'react';
import { StyleSheet, Dimensions, ScrollView, SafeAreaView } from 'react-native';
import { Title, Text, Card, Paragraph, IconButton, Menu, TouchableRipple, Surface } from "react-native-paper";
import { useIsFocused } from '@react-navigation/native';
// UI components
import { View } from '../components/Themed';
import { RootStackParamList } from '../types';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function Home({ route, navigation }: any) {
  const [notesList, setNotesList] = React.useState([]);
  const isFocused = useIsFocused();

  const onCreateNote = () => {
    navigation.navigate('DetailScreen', { 
      editMode: true, 
      access_token: route?.params.access_token 
    });
  }

  //Fetch stored notes
  const getStoredNotes = async () => {
    await fetch('http://143.198.150.54/notes/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${route?.params.access_token}`
      }
    })
    .then(response => response.json())
    .then(data => setNotesList(data))
    .catch(error => console.log(error.message));
  }

  React.useEffect(() => {
    getStoredNotes();
    console.log("log")
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Header navigation={navigation} />
      </SafeAreaView>
      <ScrollView>
        <View style={{ flexDirection: "row", justifyContent: "center", flexWrap: "wrap" }}>
          {
            notesList.map((item, id) => (
              <NoteBlock 
                key={id} 
                access_token={route?.params.access_token}
                data={item} 
                navigation={navigation} 
                getStoredNotes={getStoredNotes}
              />
            ))
          }
        </View>
      </ScrollView>
      <Surface style={styles.addButton} elevation={2}>
        <TouchableRipple
          style={{ borderRadius: 50 }}
          onPress={onCreateNote}
          rippleColor="rgba(250, 250, 250, .1)"
        >
          <IconButton icon="plus" size={45} iconColor="#fff" />
        </TouchableRipple>
      </Surface>
    </View>
  );
}

function Header({ navigation }: any) {
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <View style={styles.screenHeader}>
      <Title style={{ fontSize: 28, fontWeight: "500", fontStyle: "italic" }}>Mis Notas</Title>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<IconButton style={{ width: 36, height: 36 }} icon="account-circle" size={40} onPress={openMenu}  />}
        >
          <Menu.Item onPress={() => navigation.navigate("Login")} title="Cerrar sesión" />
      </Menu>
    </View>
  )
}

function NoteBlock({ data, access_token, navigation, getStoredNotes }: any) {
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const navigateToDetail = (edit: boolean) => {
    navigation.navigate('DetailScreen', { 
      editMode: edit, 
      access_token: access_token,
      note_id: data.id
    });
  }

  //Fetch to delete note
  const deleteNote = async () => {
    await fetch(`http://143.198.150.54/notes/${data.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
      },
    })
    .then(response => response.json())
    .then(data =>  {
      getStoredNotes();
    })
    .catch(error => console.log(error.message));
  }

  return (
    <TouchableRipple
      style={{ borderRadius: 10 }}
      onPress={() => navigateToDetail(false)}
      rippleColor="rgba(250, 250, 250, .1)"
    >
      <Card style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <Title style={styles.cardTitle}>{data.title}</Title>
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={<IconButton icon="dots-vertical" onPress={openMenu} />}
            >
            <Menu.Item 
              leadingIcon="pencil"
              title="Editar"
              onPress={() => navigateToDetail(true)}  
            />
            <Menu.Item leadingIcon="delete" onPress={deleteNote} title="Eliminar" />
          </Menu>
        </View>
        <Card.Content>
          <Paragraph style={styles.cardTextContent}>
            {data.content.slice(0, 100).concat("...")}
          </Paragraph>
        </Card.Content>
        <Card.Content>
          <Text variant="labelMedium" style={{ marginVertical: 5, color: "#bbb" }}>{data.created_at.slice(0, 10)}</Text>
        </Card.Content>
      </Card>
    </TouchableRipple>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 25,
    marginHorizontal: "5%",
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardContainer: {
    width: screenWidth - (screenWidth * .54),
    height: screenHeight - (screenHeight * .75),
    backgroundColor: "#3E364C",
    margin: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#3E364C",
    borderRadius: 10,
  },
  cardTitle: {
    marginLeft: "10%",
    fontWeight: "800",
    fontSize: 15
  },
  cardTextContent: {
    height: 120,
    fontSize: 14,
    color: "#fff",
    textAlign: "justify",
    letterSpacing: 0.1,
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: "rgb(144, 97, 246)",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 3,
    marginLeft: 10,
    transform: [{ translateY: screenHeight - (screenHeight * .12) }, { translateX: screenWidth - (screenWidth * .2) }],
  }
});
