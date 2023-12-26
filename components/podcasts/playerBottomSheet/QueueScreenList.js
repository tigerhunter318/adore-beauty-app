import React, { memo } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import Type from '../../ui/Type'
import Container from '../../ui/Container'
import QueueScreenListItem from './QueueScreenListItem'
import playerTheme from './playerTheme'
import Hr from '../../ui/Hr'
import { isValidArray } from '../../../utils/validation'

const styles = StyleSheet.create({
  listHeaderTitle: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 16,
    paddingBottom: 20,
    color: playerTheme.primaryColor
  },
  itemSeparator: {
    backgroundColor: playerTheme.secondaryColor,
    marginBottom: 20,
    marginTop: 20,
    height: 0.5
  }
})

const ItemSeparatorComponent = () => <Hr style={styles.itemSeparator} />

const ListHeaderComponent = ({ hasQueue, currentTrack }) => (
  <Container>
    <Type bold style={styles.listHeaderTitle}>
      now playing
    </Type>
    <QueueScreenListItem isCurrentTrack episode={currentTrack} />
    {hasQueue && (
      <>
        <ItemSeparatorComponent />
        <Type bold style={styles.listHeaderTitle}>
          Next up
        </Type>
      </>
    )}
  </Container>
)

const QueueScreenList = ({ data, currentTrack, currentTrackIndex, onManageQueuePress, selectedItems }) => (
  <Container pb={8}>
    <FlatList
      data={data}
      renderItem={item => (
        <QueueScreenListItem
          onManageQueuePress={onManageQueuePress}
          episode={item?.item}
          selectedItems={selectedItems?.includes(item?.item)}
          ItemSeparatorComponent={<ItemSeparatorComponent />}
          isLastItem={item.index === data?.length - 1}
          currentTrackIndex={currentTrackIndex}
        />
      )}
      ListHeaderComponent={
        <ListHeaderComponent
          hasQueue={isValidArray(data) && currentTrackIndex !== data?.length}
          currentTrack={currentTrack}
        />
      }
      contentContainerStyle={{
        paddingTop: 20,
        paddingBottom: selectedItems?.length ? 150 : 100
      }}
      initialNumToRender={5}
      onEndReachedThreshold={2.0}
      keyExtractor={(item, index) => `${item?.Id}-${index}`}
    />
  </Container>
)

export default memo(QueueScreenList)
