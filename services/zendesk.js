import ZendeskChat from 'react-native-zendesk-chat'
import envConfig from '../config/envConfig'

// init zendesk chat
const init = () => ZendeskChat.init(envConfig.zendeskAccountKey)

const startChat = ({ name = '', email = '', phone = '' }) =>
  ZendeskChat.startChat({
    name,
    email,
    phone,
    tags: [],
    department: '',
    // The behaviorFlags are optional, and each default to 'true' if omitted
    behaviorFlags: {
      showAgentAvailability: true,
      showChatTranscriptPrompt: true,
      showPreChatForm: true,
      showOfflineForm: true
    },
    // The preChatFormOptions are optional & each defaults to "optional" if omitted
    preChatFormOptions: {
      name: 'required',
      email: 'required',
      phone: 'optional',
      department: 'required'
    },
    localizedDismissButtonTitle: 'Close'
  })

export default { init, startChat }
