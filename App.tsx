import React, {useCallback, useMemo, useState} from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import Modal from 'react-native-modal';
import {ApiProvider} from '@reduxjs/toolkit/query/react';
import {postApi, useGetPostsQuery} from './store/services/posts';
import {FlashList} from '@shopify/flash-list';
import Button from './components/Button';

const REFETCH_INTERVAL = 30000;
interface Post {
  id: string;
  userId: string;
  title: string;
  body: string;
}

function AppWrapper() {
  return (
    <ApiProvider api={postApi}>
      <App />
    </ApiProvider>
  );
}

function App(): React.JSX.Element {
  const {data, isLoading, refetch} = useGetPostsQuery(null, {
    pollingInterval: REFETCH_INTERVAL,
    skipPollingIfUnfocused: true,
  });
  const [modalData, setModalData] = useState<Post | null>(null);

  const renderItem = useCallback(({item}: any) => {
    return (
      <Button onPress={() => setModalData(item)}>
        <View style={styles.item}>
          <Text style={styles.font}>{item.title}</Text>
          <Text numberOfLines={2}>{item.body}</Text>
        </View>
      </Button>
    );
  }, []);

  const keyExtracktor = useCallback((item: Post) => item.id, []);

  const modalContent = useMemo(() => {
    return (
      <>
        <View>
          <Text style={styles.font}>
            {modalData?.id}: {modalData?.title}
          </Text>
          <Text>{modalData?.body}</Text>
        </View>
        <Button onPress={() => setModalData(null)}>
          <View style={styles.button}>
            <Text>Close</Text>
          </View>
        </Button>
      </>
    );
  }, [modalData]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {!!data && (
          <FlashList
            refreshing={isLoading}
            onRefresh={refetch}
            estimatedItemSize={200}
            data={data}
            keyExtractor={keyExtracktor}
            renderItem={renderItem}
          />
        )}
        <Modal
          isVisible={!!modalData}
          onBackdropPress={() => setModalData(null)}>
          <View style={styles.modalContainer}>{modalContent}</View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    alignSelf: 'center',
    height: 40,
    width: 80,
    borderColor: 'gray',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'space-between',
  },
  font: {
    fontWeight: '700',
  },
  item: {
    padding: 12,
  },
});

export default AppWrapper;
