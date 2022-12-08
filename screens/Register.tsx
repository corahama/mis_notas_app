//Base dependecies
import React, { useState } from "react";
import { StyleSheet, SafeAreaView, Image, Alert } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FontAwesome5 } from "@expo/vector-icons";
//UI components
import { View } from "../components/Themed";
import { RootStackParamList } from '../types';

export default function Regsiter({ navigation }: NativeStackScreenProps<RootStackParamList>) {
    return(
        <View style={styles.container}>
            <SafeAreaView>
                <Text 
                    variant="headlineMedium" 
                    style={styles.title}
                >
                    Mis Notas
                </Text>
                <View style={styles.imageContainer}>
                    <Image source={require("../assets/images/sticky-note.png")} width="150" height="150" />
                </View>
                <Form navigation={navigation} />
            </SafeAreaView>
        </View>
    )
}

function Form({ navigation }: any){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
     //create form data instance
     const formdata = new FormData();

     //account validation & access token return
     const onValidateRegister = async () => {
         formdata.append("username", email);
         formdata.append("password", password);
         await fetch('http://143.198.150.54/login', {
             method: 'POST',
             headers: {
                 'Accept': 'application/json',
                 'Content-Type': 'multipart/form-data',
             },
             body: formdata
         })
         .then(response => response.json())
         .then(data => {
             navigation.navigate('Home', { access_token: data.access_token });
         })
         .catch(error => console.log(error.message));
     }

    //base sign up
    const onRegister = async () => {
        await fetch('http://143.198.150.54/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            })
        })
            .then(response => response.json())
            .then(data => {
                Alert.alert("Registro exitoso", "Tu cuenta ha sido creada con éxito");
                onValidateRegister();
            })
            .catch(error => console.log(error.message));
    }

    const onLogin = () => {
        navigation.navigate('Login');
    }

    return(
        <View style={styles.form}>
            <TextInput 
                style={styles.input}
                label="correo electrónico"
                mode="outlined"
                autoCapitalize="none"
                onChangeText={text => setEmail(text)}
            />
            <TextInput
                style={styles.input}
                label="contraseña"
                mode="outlined"
                autoCapitalize="none"
                secureTextEntry={true}
                onChangeText={text => setPassword(text)}
            />
            <TextInput
                style={styles.input}
                label="confirmar contraseña"
                mode="outlined"
                autoCapitalize="none"
                secureTextEntry={true}
                onChangeText={text => console.log(text)}
            />
            <Button 
                style={{ marginVertical: 20 }} 
                mode="contained" buttonColor="#74ABBC" 
                onPress={onRegister}
            >
                Registrarse
            </Button>
            <Text variant="labelMedium" style={styles.bottomAdvice}>¿Ya tienes una cuenta?</Text>
            <Button 
                style={{ marginVertical: 20 }} 
                mode="contained"
                onPress={onLogin}
            >
                <FontAwesome5 
                    name="user-alt" 
                    size={11} 
                />
                {"  "}Inicia Sesión
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: "20%",
    },
    title: {
        fontStyle: "italic",
        fontWeight: "800",
        textAlign: "center",
    },
    imageContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: "7%",
    },
    form: {
        justifyContent: "center",
        margin: "10%"
    },
    input: {
        marginVertical: 10
    },
    bottomAdvice: {
        textAlign: "center",
        color: "#bbb",
    }
});