import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { ProfDataService } from './ListProf';
import { Button } from '../../components';

export default function EditProf(props) {
    const { id, setEditMode } = props;
    const profDataService = new ProfDataService();
    const [matricule, setMatricule] = useState('');
    const [nom, setNom] = useState('');
    const [tauxHoraire, setTauxHoraire] = useState('');
    const [nbHeure, setNbHeure] = useState('');

    useEffect(() => {
        profDataService.getAll().then((profs) => {
            const prof = profs.find((item) => item.matricule === id) || {};
            setMatricule(prof.matricule);
            setNom(prof.nom);
            setTauxHoraire(prof.tauxHoraire);
            setNbHeure(prof.nbHeure);
        });
    }, [id]);

    const handleSave = () => {
        if (matricule && nom && tauxHoraire && nbHeure) {
            const prof = { matricule, nom, tauxHoraire, nbHeure };
            profDataService.update(id, prof).then(() => {
                setEditMode({ editMode: false, id: null });
                setMatricule('');
                setNom('');
                setTauxHoraire('');
                setNbHeure('');
            });
            alert('Enseignant modifié avec succès');
        }
        else alert('Veuillez remplir tous les champs');
    };

    const handleDelete = () => {
        profDataService.delete(id).then(() => {
            setEditMode({ editMode: false, id: null });
            alert('Enseignant supprimé');
        });
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Matricule"
                value={matricule}
                onChangeText={(text) => setMatricule(text)}
                editable={false}
            />
            <TextInput
                style={styles.input}
                placeholder="Nom"
                value={nom}
                onChangeText={(text) => setNom(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Taux Horaire"
                value={tauxHoraire}
                keyboardType='numeric'
                onChangeText={(text) => setTauxHoraire(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Nombre d'heures"
                value={nbHeure}
                keyboardType='numeric'
                onChangeText={(text) => setNbHeure(text)}
            />
            <Button color='info' onPress={handleSave}>
                Enregistrer
            </Button>
            <Button color='error' onPress={handleDelete}>
                Supprimer
            </Button>
            <Button color='default' onPress={() => setEditMode({ editMode: false })}>
                Annuler
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    input: {
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
