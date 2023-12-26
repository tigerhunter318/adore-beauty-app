import React, { forwardRef, useState, useEffect } from 'react'
import { Platform } from 'react-native'
import RNDatePicker from 'react-native-date-picker'
import Container from './Container'
import Type from './Type'
import CustomBottomSheet from './CustomBottomSheet'
import theme from '../../constants/theme'

const sheetHeight = Platform.select({
  ios: 300,
  android: 230
})

const styles = {
  container: {
    height: sheetHeight
  },
  header: {
    height: 50,
    alignItems: 'center',
    flexDirection: 'row'
  },
  doneButton: {
    position: 'absolute',
    right: 0
  }
}

const DatePicker = ({ onSave, date, ...rest }, ref) => {
  const [newDate, setNewDate] = useState(null)

  const handleDateChange = curDate => {
    setNewDate(curDate)
  }

  const handleSaveDate = () => {
    onSave(newDate)
  }

  useEffect(() => {
    setNewDate(date)
  }, [date])

  return (
    <CustomBottomSheet
      ref={ref}
      height={sheetHeight}
      enabledContentGestureInteraction={false}
      content={
        <Container style={styles.container}>
          <Container style={styles.header} background={theme.black} justify>
            <Container rows align center>
              <Type semiBold heading size={16} color={theme.white}>
                Date of birthday
              </Type>
            </Container>
            <Container style={styles.doneButton} pv={1} pr={1.5} onPress={() => handleSaveDate()}>
              <Type semiBold color={theme.white}>
                Done
              </Type>
            </Container>
          </Container>
          <Container background={theme.white} center justify>
            <RNDatePicker date={newDate} onDateChange={handleDateChange} {...rest} />
          </Container>
        </Container>
      }
    />
  )
}

export default forwardRef(DatePicker)
