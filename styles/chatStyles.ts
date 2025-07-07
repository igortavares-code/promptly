import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgb(237 225 209)',
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  chatContentContainer: {
    paddingBottom: 20,
  },
  noMessagesText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
  },
  loadingText: {
    marginLeft: 8,
    color: '#000',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  textBoxArea: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 616,
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'rgb(191 177 158)',
    backgroundColor: 'rgb(252 250 247)',
  },
  textInput: {
    padding: 10,
    borderRadius: 20,
    borderColor: 'rgb(191 177 158)',
    borderWidth: 1,
    fontSize: 16,
    minHeight: 40,
    maxHeight: 120,
    paddingTop: Platform.OS === 'ios' ? 10 : 8,
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
  },
  buttons: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  optionsOutlineButton: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    padding: 5,
  },
  circleOutlineButton: {
    paddingLeft: 10,
  },
});