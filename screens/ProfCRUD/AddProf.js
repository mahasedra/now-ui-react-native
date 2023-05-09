import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, TextInput } from 'react-native';
import { AsyncStorage } from 'react-native';

const AddProf = ({ navigation }) => {
    const [matricule, setMatricule] = useState('');
    const [nom, setNom] = useState('');
    const [tauxHoraire, setTauxHoraire] = useState('');
    const [nbHeure, setNbHeure] = useState('');

    const saveProf = async () => {
        if (!matricule || !nom || !tauxHoraire || !nbHeure) {
            alert('Veuillez remplir tous les champs');
            return;
        }
        const newProf = {
            matricule: matricule,
            nom: nom,
            tauxHoraire: tauxHoraire,
            nbHeure: nbHeure,
        };
        try {
            const storedProf = await AsyncStorage.getItem('profs');
            let profs = [];
            if (storedProf) {
                profs = JSON.parse(storedProf);
            }
            profs.push(newProf);
            await AsyncStorage.setItem('profs', JSON.stringify(profs));
            alert('Enseignant ajouté avec succès');
            setMatricule('');
            setNom('');
            setTauxHoraire('');
            setNbHeure('');
            navigation.goBack();
        } catch (error) {
            console.log(error);
            alert("Erreur lors de l'ajout du professeur");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.inputs}
                placeholder="Matricule"
                onChangeText={setMatricule}
                value={matricule}
            />
            <TextInput
                style={styles.inputs}
                placeholder="Nom"
                onChangeText={setNom}
                value={nom}
            />
            <TextInput
                style={styles.inputs}
                placeholder="Taux horaire"
                keyboardType="numeric"
                onChangeText={setTauxHoraire}
                value={tauxHoraire}
            />
            <TextInput
                style={styles.inputs}
                placeholder="Nombre d'heures"
                keyboardType="numeric"
                onChangeText={setNbHeure}
                value={nbHeure}
            />
            <Button
                title="Ajouter"
                onPress={saveProf}
                buttonStyle={styles.button}
            />
        </View>
    );
};
export default AddProf;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    inputs: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 10,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    save: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
