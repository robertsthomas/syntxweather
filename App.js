import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { StyleSheet, Text, View, ActivityIndicator, SafeAreaView } from 'react-native';
import moment from 'moment'


export default function App() {

  const [userLoc, setLoc] = useState()
  const [currWeatherData, setCurrWeatherData] = useState()

  const url = 'https://samples.openweathermap.org/data/2.5/forecast/daily?id=524901&appid=b1b15e88fa797225412429c1c50c122a1'

  useEffect(() => {
    axios.get(url).then((res) => {
      setCurrWeatherData(res.data)
    })
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      {currWeatherData ?
        <View style={{ paddingTop: 20, paddingLeft: 20 }}>
          <Text style={styles.citytxt}>{currWeatherData.city.name},</Text>
          <Text style={styles.citytxt}>{currWeatherData.city.country}</Text>
          <Text style={{ fontSize: 24 }}>{moment().utc(3600).format('dddd gggg')}</Text>
        </View>
        :
        <ActivityIndicator size="large" color="#0000ff" />
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  citytxt: {
    fontSize: 40
  }
});
