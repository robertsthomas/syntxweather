import React, { useEffect, useState } from 'react'
import { Text, View, FlatList, TextInput } from 'react-native'
import axios from 'axios'

export default function Cities(props) {
    const [value, onChangeText] = useState('Search Now');
    const [cityNames, setCityNames] = useState()

    useEffect(() => {
        console.log()
    })

    const searchCities = async (e) => {
        await axios.get(`https://www.metaweather.com/api/location/search/?query=${value}`).then(data => {
            setCityNames(data.data.slice(0, 7))
        })
    }

    const getWoid = (idx) => {
        const woeid = (cityNames[idx].woeid)
        props.navigation.state.params.newwoeid(woeid)
        props.navigation.goBack()
    }

    return (

        <View>
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={text => onChangeText(text)}
                onChange={searchCities}
                value={value}
            />
            <View>
                {cityNames && cityNames.map((data, index) => {
                    const idx = index
                    return (
                        <Text key={idx} style={{ fontSize: 30, padding: 5, alignSelf: 'center' }} onPress={() => getWoid(idx)}>{data.title}</Text>
                    )
                })}
            </View>
        </View>
    )
}
