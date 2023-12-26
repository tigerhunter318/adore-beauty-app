import React, { useState, useEffect } from 'react'
import { FlatList, StyleSheet, TextInput, Platform } from 'react-native'
import Modal from 'react-native-modal'
import Type from '../ui/Type'
import Container from '../ui/Container'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'
import theme from '../../constants/theme'

const styles = StyleSheet.create({
  dropdown: {
    borderWidth: 1.5,
    borderColor: theme.borderColor,
    borderRadius: 2,
    paddingRight: 20
  },
  downArrow: {
    position: 'absolute',
    right: 20
  },
  dropdownContent: {
    backgroundColor: theme.white
  },
  active: {
    backgroundColor: theme.borderColor
  },
  input: {
    height: 36,
    paddingVertical: 0,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: theme.white,
    borderWidth: 1,
    borderColor: theme.lightBorder,
    shadowColor: theme.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    flexGrow: 1,
    ...Platform.select({
      ios: {
        borderRadius: 5
      },
      android: {}
    })
  }
})

type FormDropdownProps = {
  options: any[]
  optionChanged: (item: any) => void
  placeholder?: string
  name: string
  required?: boolean
  form: any
  disabled?: boolean
  hasSearch?: boolean
  hasCloseFooter?: boolean
}

const FormDropdown = ({
  options,
  optionChanged,
  placeholder,
  name,
  required,
  form,
  disabled,
  hasSearch = false,
  hasCloseFooter = false
}: FormDropdownProps) => {
  const [modalVisibility, setModalVisibility] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const hasState = !!form?.formState
  const selectedOption = form.getValue(name)
  const color = disabled ? theme.textGreyDark : theme.lightBlack

  const handleDropdownPress = () => {
    setModalVisibility(true)
  }

  const handleChangeText = (text: string) => {
    setSearchTerm(text)
  }

  const onMount = () => {
    if (hasState) {
      form.setRequired({ [name]: required })
    }
  }

  useEffect(onMount, [])

  let optionComponent = (
    <>
      <Type size={15} color={color}>
        {placeholder}
      </Type>
      <Container style={styles.downArrow}>
        <AdoreSvgIcon name="AngleDown" width={18} height={24} color={color} />
      </Container>
    </>
  )

  let filteredOptions = options || []
  if (hasSearch) {
    filteredOptions = options?.filter((option: { name: any }) => `${option.name}`.toLowerCase().startsWith(searchTerm))
  }

  if (selectedOption) {
    optionComponent = (
      <>
        <Type size={15} color={theme.lightBlack} numberOfLines={1} pr={5}>
          {selectedOption?.name}
        </Type>
        <Container style={styles.downArrow}>
          <AdoreSvgIcon name="AngleDown" width={16} height={22} />
        </Container>
      </>
    )
  }

  return (
    <Container>
      <Type mb={0.8} heading selectable={false} color={disabled && theme.textGreyDark}>
        {name}
      </Type>
      <Container
        mt={0}
        rows
        style={[styles.dropdown, disabled && styles.active]}
        ph={1.5}
        pv={1.0}
        align
        onPress={!disabled && handleDropdownPress}
      >
        {optionComponent}
      </Container>

      <Modal
        isVisible={modalVisibility}
        onBackdropPress={() => setModalVisibility(false)}
        style={{ paddingTop: 80, paddingBottom: 80 }}
      >
        <Container style={[styles.dropdownContent, hasSearch && { flex: 1 }]}>
          {hasSearch && (
            <Container ph={1} pt={1}>
              <TextInput
                style={styles.input}
                onChangeText={handleChangeText}
                value={searchTerm}
                placeholder="Search a Brand..."
                clearButtonMode="always"
                spellCheck={false}
                autoCorrect={false}
                autoCapitalize="none"
                testID="SearchBox.TextInput"
              />
            </Container>
          )}
          <FlatList
            data={filteredOptions}
            renderItem={({ item }) => (
              <Container
                rows
                align
                ph={1}
                pv={0.5}
                onPress={() => {
                  setModalVisibility(false)
                  optionChanged(item)
                }}
                style={selectedOption?.id === item?.id && styles.active}
              >
                <Container flex={1} p={1}>
                  <Type numberOfLines={2}>{item?.name}</Type>
                </Container>
              </Container>
            )}
            keyExtractor={item => `dropdown-${item?.id}`}
          />
          {hasCloseFooter && (
            <Container pv={1} justify center onPress={() => setModalVisibility(false)}>
              <Type color={theme.lightBlue}>Close</Type>
            </Container>
          )}
        </Container>
      </Modal>
    </Container>
  )
}

export default FormDropdown
