import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image } from 'react-native';
import { AsyncStorage } from 'react-native';
import EditProf from './EditProf';
import { useRoute } from '@react-navigation/native';
import { Block, theme } from 'galio-framework';

import { nowTheme } from '../../constants';

const STORAGE_KEY = 'profs';

export class ProfDataService {
    getAll() {
        return AsyncStorage.getItem(STORAGE_KEY).then((data) => {
            return JSON.parse(data) || [];
        });
    }

    create(prof) {
        return this.getAll().then((profs) => {
            profs.push(prof);
            return AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profs));
        });
    }

    update(matricule, prof) {
        return this.getAll().then((profs) => {
            const index = profs.findIndex(element => element.matricule === matricule);
            profs[index] = prof;
            return AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profs));
        });
    }

    delete(matricule) {
        return this.getAll().then((profs) => {
            const result = profs.filter(element => element.matricule !== matricule);
            return AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(result));
        });
    }
}

const ListProf = ({ navigation }) => {
    const [profs, setProfs] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedProf, setSelectedProf] = useState(null);
    const [searchText, setSearchText] = useState(null);
    const [{ min, max, total }, setMinMax] = useState({ min: null, max: null, total: null })

    const profDataService = new ProfDataService();

    const route = useRoute()
    useEffect(() => {
        refreshList();
    }, []);
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Charger vos données ici
            console.log("Test")
            console.log(navigation.getState())
            refreshList();
        });

        return unsubscribe;
    }, [navigation]);
    useEffect(() => {
        refreshList();
    }, [searchText]);
    const refreshList = () => {
        profDataService.getAll().then((profs) => {
            if (!searchText) {
                setProfs(profs);
            }
            else {
                const searchedText = profs.filter((element) => element.nom.toLowerCase().includes(searchText.toLowerCase()) || element.matricule.toLowerCase().includes(searchText.toLowerCase()))
                if (searchedText) setProfs(searchedText)
                else setProfs(profs);
            }
            const max = profs.reduce((prev, current) => (prev.nbHeure * prev.tauxHoraire > current.nbHeure * current.tauxHoraire) ? prev : current);
            const min = profs.reduce((prev, current) => (prev.nbHeure * prev.tauxHoraire < current.nbHeure * current.tauxHoraire) ? prev : current);
            let total = 0
            profs.forEach(element => {
                total = total + (element.tauxHoraire * element.nbHeure)
            });
            setMinMax({ min, max, total })
        });
    };

    const setEditMode = ({ editMode = false, id = null }) => {
        if (id) setSelectedProf(id);
        setIsEditMode(editMode);
        refreshList()
    };

    const renderProf = ({ item }) => {
        const imageStyles = [styles.horizontalImage];
        const cardContainer = [styles.card, styles.shadow];
        const imgContainer = [
            styles.imageContainer,
            styles.horizontalStyles,
            styles.shadow
        ];
        return (
            <TouchableOpacity
                style={styles.profContainer}
                onPress={() =>
                    setEditMode({ editMode: true, id: item.matricule })
                }
            >
                <Block row='horizontal' card flex style={cardContainer}>
                    <Block flex style={imgContainer}>
                        <Image resizeMode="cover" source={require('../../assets/imgs/profile-icon.png')} style={imageStyles} />
                    </Block>
                    <Block flex space="between" style={styles.cardDescription}>
                        <Block flex>
                            <Text
                                style={{ fontFamily: 'montserrat-regular' }}
                                size={14}
                                color={nowTheme.COLORS.SECONDARY}
                            >
                                Matricule: {item.matricule}
                            </Text>
                            <Text
                                style={{ fontFamily: 'montserrat-regular' }}
                                size={14}
                                color={nowTheme.COLORS.SECONDARY}
                            >
                                Nom: {item.nom}
                            </Text>
                            <Text
                                style={{ fontFamily: 'montserrat-regular' }}
                                size={14}
                                color={nowTheme.COLORS.SECONDARY}
                            >
                                Taux Horaire: {item.tauxHoraire}
                            </Text>
                            <Text
                                style={{ fontFamily: 'montserrat-regular' }}
                                size={14}
                                color={nowTheme.COLORS.SECONDARY}
                            >
                                Nombre d'heures: {item.nbHeure}
                            </Text>
                        </Block>
                    </Block>
                </Block>
            </TouchableOpacity >
        );
    };

    return (
        <View style={styles.container}>
            {isEditMode ? (
                <EditProf setEditMode={setEditMode} id={selectedProf} />
            ) : (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Rechercher"
                        value={searchText}
                        onChangeText={(text) => setSearchText(text)}
                    />
                    <TouchableOpacity
                        style={styles.addButton}
                        underlayColor="#ff7043"
                        onPress={() => navigation.navigate('AddProf')}
                    >
                        <Text style={styles.addButtonText}>Ajouter +</Text>
                    </TouchableOpacity>
                    <FlatList
                        data={profs}
                        renderItem={renderProf}
                        keyExtractor={(item) => item.matricule}
                    />
                    {min && max && total ? (<Block>
                        <Text>Prestations:</Text>
                        <Text>Minimum: {min.tauxHoraire * min.nbHeure}</Text>
                        <Text>Maximum: {max.tauxHoraire * max.nbHeure}</Text>
                        <Text>Total: {total}</Text>
                    </Block>) : null}

                </>
            )}
        </View>
    );
};

export default ListProf;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    listItem: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    listItemText: {
        fontSize: 16,
    },
    card: {
        backgroundColor: theme.COLORS.WHITE,
        marginVertical: theme.SIZES.BASE,
        borderWidth: 0,
        minHeight: 114,
        marginBottom: 4
    },
    cardTitle: {
        paddingHorizontal: 9,
        paddingTop: 7,
        paddingBottom: 15
    },
    cardDescription: {
        padding: theme.SIZES.BASE / 2
    },
    imageContainer: {
        borderRadius: 3,
        elevation: 1,
        overflow: 'hidden'
    },
    image: {
        // borderRadius: 3,
    },
    horizontalImage: {
        height: 122,
        width: 'auto'
    },
    horizontalStyles: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
    },
    verticalStyles: {
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0
    },
    fullImage: {
        height: 215
    },
    shadow: {
        shadowColor: '#8898AA',
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 6,
        shadowOpacity: 0.1,
        elevation: 2
    },
    articleButton: {
        fontFamily: 'montserrat-bold',
        paddingHorizontal: 9,
        paddingVertical: 7
    }
});

