import React, { useState, useEffect, useRef, useCallback } from 'react';

import { StyleSheet, View, Text, Button } from 'react-native';
import Vosk from 'react-native-vosk';

export default function App(): JSX.Element {
    const [ready, setReady] = useState<Boolean>(false);
    const [recognizing, setRecognizing] = useState<Boolean>(false);
    const [result, setResult] = useState<String | undefined>();
    // const [grammar, setGrammar] = useState<String[] | undefined>();
    const vosk = useRef(new Vosk()).current;


    const load = useCallback(() => {
        vosk
            .loadModel('vosk-model-small-pt-0.3')
            // .loadModel('model-en-us')
            .then(() => setReady(true))
            .catch((e: any) => console.log(e));
    }, [vosk]);

    const unload = useCallback(() => {
        vosk.unload();
        setReady(false);
    }, [vosk]);

    useEffect(() => {
        const resultEvent = vosk.onResult((res: { data: String }) => {
            console.log(res);

            console.log('A onResult event has been caught: ' + res.data);
        });

        return () => {
            resultEvent.remove();
        };
    }, [vosk]);

    // const fs = require('fs');
    // const file = fs.readFileSync('../src/words.txt', 'utf8').split('\n');

    // RNFS.readFile(words, 'utf8')
    //     .then(contents => {
    //         console.log(contents);
    //         const text = contents.split('\n');
    //         setGrammar(text);
    //     })
    //     .catch(error => {
    //         console.log(error.message);
    //     });

    const grammar = ['esquerda', 'direita', '[unk]', 'cima', 'baixo', 'frente', 'trás', 'cadastrar', 'excluir', 'editar', 'salvar', 'cancelar', 'voltar', 'sim', 'não', 'iniciar', 'parar', 'pausar', 'continuar'];
    // const grammar = ['gauche', 'droite', '[unk]'];
    // const grammar = ['left', 'right', '[unk]'];

    const record = () => {
        if (!ready) return;
        console.log('Starting recognition...');
        setRecognizing(true);
        vosk
            .start(grammar)
            .then((res: string) => {
                console.log('Result is: ' + res);
                setResult(res);
            })
            .catch((e: any) => {
                console.log('ERRO PQP DNV: ' + e);
            })
            .finally(() => {
                setRecognizing(false);
            });
    };

    return (
        <View style={styles.container}>
            <Button
                onPress={ready ? unload : load}
                title={ready ? "Unload model" : "Load model"}
                color="blue"
            />
            <Button
                onPress={record}
                title="Record"
                disabled={ready === false || recognizing === true}
                color="#841584"
            />
            <Text>Recognized word:</Text>
            <Text>{result}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        width: 60,
        height: 60,
        marginVertical: 20,
    },
});
