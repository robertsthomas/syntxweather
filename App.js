import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { StyleSheet, Text, View, TextInput, ActivityIndicator, SafeAreaView, Image, ScrollView, TouchableOpacity } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import moment from 'moment'
import Cities from './Cities'
import CityDay from './CityDay';


const App = (props) => {


  const [currWeatherData, setCurrWeatherData] = useState()
  const [woeid, setwoeid] = useState(0)
  const [todaysData, setTodaysData] = useState()

  useEffect(() => {

    const getLoc = async () => {
      const d = await axios.get(`https://www.metaweather.com/api/location/search/?lattlong=34.053490,-118.245323`)
      setwoeid(d.data[0].woeid)
    }

    const getTodaysData = async () => {
      await axios.get(`https://www.metaweather.com/api/location/2487889/`).then(({ data }) => {
        setTodaysData(data.consolidated_weather[0])
        setCurrWeatherData(data)
      })
    }

    getLoc()
    getTodaysData()
  }, [])

  const getNewWOEID = (e) => {
    axios.get(`https://www.metaweather.com/api/location/${e}/`).then(({ data }) => {
      setTodaysData(data.consolidated_weather[0])
      setCurrWeatherData(data)
    })
  }

  const cToF = (celsius) => {
    let cToFahr = celsius * 9 / 5 + 32;
    return cToFahr
  }


  const Item = ({ data }) => {
    const abbr = data.weather_state_abbr
    const dt = data.applicable_date
    const temp = data.the_temp
    console.log(woeid)
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('CityDay',{
            woeid,
            data: dt
          })
        }}
        style={styles.item}
      >
        <Text style={{ color: 'white', fontSize: 26 }}>
          {moment(dt).format('ddd')}
        </Text>
        <Image
          style={{ width: 50, height: 50 }}
          source={{ uri: `https://www.metaweather.com/static/img/weather/png/${abbr}.png` }}
        />
        <Text style={{ color: 'white', fontSize: 26 }}>
          {Math.trunc(cToF(temp)) + '°'}
        </Text>
      </TouchableOpacity>
    );
  }


  return (
    <View style={styles.container}>
      {currWeatherData ?
        <View>
          <TouchableOpacity style={styles.searchBox} onPress={() => props.navigation.navigate('Cities', { newwoeid: getNewWOEID })}>
            <Image style={{ width: 25, height: 25 }} source={require('./search.png')} />
          </TouchableOpacity>

          <View style={{ paddingTop: 10, paddingLeft: 20 }}>
            <Text style={styles.citytxt}>{currWeatherData.title},</Text>
            <Text style={styles.citytxt}>{currWeatherData.parent.title}</Text>
            <Text style={{ fontSize: 24 }}>{moment().utc(currWeatherData.time).format('dddd, Do')}</Text>
          </View>

          <View style={{ height: '40%', justifyContent: 'center' }}>
            <Text
              style={{ alignSelf: 'center', fontSize: 50 }}>Today
            </Text>

            <Image
              style={{ width: 100, height: 100, alignSelf: 'center', marginTop: 10 }}
              source={{ uri: `https://www.metaweather.com/static/img/weather/png/${todaysData.weather_state_abbr}.png` }}
            />
            <Text style={{ fontSize: 40, alignSelf: 'center' }}>
              {Math.trunc(cToF(todaysData.the_temp)) + '°'}
            </Text>
          </View>

          <ScrollView horizontal style={{ backgroundColor: '#B4C5E4', padding: 20, borderBottomLeftRadius: 40, borderTopLeftRadius: 40, marginLeft: 30 }}>
            {currWeatherData.consolidated_weather.map((data, idx) => {
              return (
                <Item
                  data={data}
                  key={idx}
                />
              )
            })}
          </ScrollView>
        </View>

        :
        <ActivityIndicator size="large" color="#0000ff" />
      }
    </View>
  );

}

const AppNavigator = createStackNavigator({
  Home: App,
  Cities: Cities,
  CityDay: CityDay
},
  {
    initialRouteName: 'Home',
  });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3D52D5'
  },
  citytxt: {
    fontSize: 40,
    color: '#FBFFF1'
  },
  searchBox: {
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: 'white',
    padding: 5,
    margin: 5,
    backgroundColor: '#FBFFF1',
    opacity: .4,
    borderRadius: 40
  },
  item: {
    maxWidth: 150,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#090C9B',
    paddingVertical: 30,
    paddingHorizontal: 40,
    marginHorizontal: 10,
    borderRadius: 20
  },
});

export default createAppContainer(AppNavigator)