import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  HelperText,
  IconButton,
  Menu,
  Surface,
  Text,
  TextInput
} from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RPH, RPW } from '../utils/dimensions';
import { BASE_URL, DELETE_MEDICINE, PUT_MEDICINE } from '../utils/urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const EditMedicineScreen = ({ route, navigation }) => {
  const data = route.params;

  const [name, setName] = React.useState(data.name);
  const [numberOfStrips, setNumberOfStrips] = React.useState(
    String(data.numberOfStrips)
  );
  const [numberOfUnitsPerStrip, setNumberOfUnitsPerStrip] = React.useState(
    String(data.numberOfUnitsPerStrip)
  );
  const [numberOfUnitsPerDay, setNumberOfUnitsPerDay] = React.useState(
    String(data.numberOfUnitsPerDay)
  );
  const [frequency, setFrequency] = React.useState(data.frequency);
  const [startDate, setStartDate] = React.useState(new Date(data.startDate));
  const [notificationPeriod, setNotificationPeriod] = React.useState(
    String(data.notificationPeriod)
  );
  const [visible, setVisible] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [isSaveLoading, setIsSaveLoading] = React.useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);
  const [disable, setDisable] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const onDismissSingle = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = React.useCallback(
    params => {
      setOpen(false);
      console.log(params.date);
      setStartDate(params.date);
    },
    [setOpen, setStartDate]
  );

  const putMedicine = async () => {
    setIsSaveLoading(true);
    setDisable(true);
    try {
      const url = `${BASE_URL}/${PUT_MEDICINE}/${data._id}`;
      const token = await AsyncStorage.getItem('token');

      const res = await axios.put(
        url,
        {
          name: name,
          numberOfStrips: parseInt(numberOfStrips),
          numberOfUnitsPerStrip: parseInt(numberOfUnitsPerStrip),
          frequency: frequency,
          numberOfUnitsPerDay: parseInt(numberOfUnitsPerDay),
          startDate: startDate,
          notificationPeriod: parseInt(notificationPeriod)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.status == 201 && res.data.data.inventory !== 'undefined') {
        navigation.goBack();
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
    }
    setIsSaveLoading(false);
    setDisable(false);
  };

  const deleteMedicine = async () => {
    setIsDeleteLoading(true);
    setDisable(true);
    try {
      const url = `${BASE_URL}/${DELETE_MEDICINE}/${data._id}`;
      const token = await AsyncStorage.getItem('token');

      const res = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.status == 200) {
        navigation.goBack();
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
    }
    setDisable(false);
    setIsDeleteLoading(false);
  };

  return (
    <SafeAreaView style={styles.body}>
      <Surface mode="flat" elevation={1} style={styles.surface}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <IconButton
              icon="close"
              size={28}
              onPress={() => navigation.goBack()}
            />
            <Text variant="titleLarge">Edit Medicine</Text>
          </View>
          <View style={styles.headerText}>
            {isDeleteLoading ? (
              <ActivityIndicator
                animating={true}
                style={{ marginRight: RPW(3) }}
              />
            ) : (
              <IconButton
                icon="delete"
                size={28}
                onPress={() => deleteMedicine()}
              />
            )}
            <Button
              loading={isSaveLoading}
              disabled={disable}
              mode="contained"
              onPress={() => putMedicine()}>
              Save
            </Button>
          </View>
        </View>

        <View style={styles.container}>
          <TextInput
            mode="outlined"
            label="Name"
            value={name}
            error={isError}
            autoCapitalize
            autoFocus={true}
            onChangeText={text => setName(text)}
            style={styles.singleInput}
            onSubmitEditing={() => {
              this.secondTextInput.focus();
            }}
          />

          <View style={styles.multipleInputs}>
            <TextInput
              mode="outlined"
              label="Strips"
              value={numberOfStrips}
              error={isError}
              keyboardType="numeric"
              onChangeText={text => setNumberOfStrips(text)}
              style={styles.firstInput}
              ref={input => {
                this.secondTextInput = input;
              }}
              onSubmitEditing={() => {
                this.thirdTextInput.focus();
              }}
            />
            <TextInput
              mode="outlined"
              label="Pills / Strips"
              value={numberOfUnitsPerStrip}
              error={isError}
              keyboardType="numeric"
              onChangeText={text => setNumberOfUnitsPerStrip(text)}
              style={styles.secondInput}
              ref={input => {
                this.thirdTextInput = input;
              }}
              onSubmitEditing={() => {
                this.fourthTextInput.focus();
              }}
            />
          </View>

          <View style={styles.multipleInputs}>
            <TextInput
              mode="outlined"
              label="Pills / Day"
              value={numberOfUnitsPerDay}
              error={isError}
              keyboardType="numeric"
              onChangeText={text => setNumberOfUnitsPerDay(text)}
              style={styles.firstInput}
              ref={input => {
                this.fourthTextInput = input;
              }}
              onSubmitEditing={() => {
                this.fifthTextInput.focus();
              }}
            />
            <TextInput
              mode="outlined"
              label="Frequency"
              value={frequency}
              editable={false}
              error={isError}
              right={
                <TextInput.Icon
                  icon="arrow-down-drop-circle"
                  onPress={() => setVisible(!visible)}
                />
              }
              style={styles.secondInput}
            />
          </View>

          <View style={styles.multipleInputs}>
            <TextInput
              mode="outlined"
              label="Start Date"
              value={startDate.toLocaleDateString('en-GB')}
              editable={false}
              error={isError}
              right={
                <TextInput.Icon icon="calendar" onPress={() => setOpen(true)} />
              }
              style={styles.firstInput}
            />
            <TextInput
              mode="outlined"
              label="Reminder"
              value={notificationPeriod}
              error={isError}
              keyboardType="numeric"
              onChangeText={text => setNotificationPeriod(text)}
              style={styles.secondInput}
              ref={input => {
                this.fifthTextInput = input;
              }}
            />
          </View>

          <HelperText type="error" visible={isError}>
            Something went wrong!
          </HelperText>

          <View style={styles.menu}>
            <Menu
              visible={visible}
              onDismiss={() => setVisible(!visible)}
              anchor={{ x: RPW(96), y: RPH(33) }}>
              <Menu.Item
                onPress={() => {
                  setFrequency('DAILY');
                  setVisible(!visible);
                }}
                title="DAILY"
              />
              <Menu.Item
                onPress={() => {
                  setFrequency('ALTERNATE DAYS');
                  setVisible(!visible);
                }}
                title="ALTERNATE"
              />
              <Menu.Item
                onPress={() => {
                  setFrequency('WEEKLY');
                  setVisible(!visible);
                }}
                title="WEEKLY"
              />
            </Menu>
          </View>
        </View>

        <SafeAreaProvider>
          <DatePickerModal
            locale="en-GB"
            mode="single"
            visible={open}
            onDismiss={onDismissSingle}
            date={startDate}
            onConfirm={onConfirmSingle}
          />
        </SafeAreaProvider>
      </Surface>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1
  },
  surface: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: RPW(4),
    marginTop: RPH(1),
    marginBottom: RPH(2)
  },
  headerText: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    paddingHorizontal: RPW(4)
  },
  singleInput: {
    marginBottom: RPH(2)
  },
  multipleInputs: {
    flexDirection: 'row',
    marginBottom: RPH(2)
  },
  firstInput: {
    width: RPW(44),
    marginRight: RPW(4)
  },
  secondInput: {
    width: RPW(44)
  },
  menu: {
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'center'
  }
});

export default EditMedicineScreen;
