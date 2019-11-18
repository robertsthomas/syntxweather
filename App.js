import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { StyleSheet, Text, View, ActivityIndicator, SafeAreaView, Image, ScrollView, TouchableOpacity } from 'react-native';
import moment from 'moment'


export default function App() {

  const [currWeatherData, setCurrWeatherData] = useState()
  const [woeid, setwoeid] = useState(0)
  const [latlng, setlatlng] = useState()


  useEffect(() => {

    const getLoc = async () => {
      const d = await axios.get(`https://www.metaweather.com/api/location/search/?lattlong=34.053490,-118.245323`)
      await setwoeid(d.data[0].woeid)
    }

    const getData = async () => {
      await axios.get(`https://www.metaweather.com/api/location/2442047/`).then(({data}) => {
        setCurrWeatherData(data)
      })
    }

    getLoc()
    getData()
  }, [])


  const Item = ({dt}) => {
    // console.log(data.data)
    return (
      <View
        style={styles.item}
      >
        <Text style={{ color: 'white' }}>
          {moment(dt).format('ddd')}
        </Text>
      </View>
    );
  }




  return (
    <SafeAreaView style={styles.container}>
      {currWeatherData ?
        <View>
          <View style={{ paddingTop: 20, paddingLeft: 20 }}>
            <Text style={styles.citytxt}>{currWeatherData.title},</Text>
            {/* <Text style={styles.citytxt}>{currWeatherData.city.country}</Text> */}
            <Text style={{ fontSize: 24 }}>{moment().utc(currWeatherData.time).format('dddd, Do')}</Text>
          </View>

          <View style={{ height: '40%', justifyContent: 'center', position: 'relative' }}>
            <View>
              <Text
                style={{ alignSelf: 'center', fontSize: 50 }}>Today
                </Text>

              <Image
                style={{ width: 200, height: 200, alignSelf: 'center', position: 'absolute' }}
                source={{ uri: 'http://openweathermap.org/img/wn/10d@2x.png' }}
              />
            </View>
          </View>

          <ScrollView horizontal style={{ backgroundColor: '#B4C5E4', padding: 20, borderBottomLeftRadius: 40, borderTopLeftRadius: 40, marginLeft: 30, top: '30%' }}>
            {currWeatherData.consolidated_weather.map((data, idx) => {
              const dt = data.applicable_date
              return (
                <Item dt={dt} key={idx} />
              )
            })}
          </ScrollView>
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
  },
  item: {
    backgroundColor: '#090C9B',
    paddingVertical: 30,
    paddingHorizontal: 40,
    marginHorizontal: 10,
    borderRadius: 20
  },
});
