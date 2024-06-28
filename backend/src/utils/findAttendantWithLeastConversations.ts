import { User } from "../entities/User.js";
import { Conversation } from "../entities/Conversation.js";
import { database } from "../services/database.js";

export async function findAttendantWithLeastConversations(): Promise<User | null> {
  //TODO: melhorar o metodo de distribuição de conversas.
  // ? talvez um message queue
  const userRepository = database.getRepository(User);
  const conversationRepository = database.getRepository(Conversation);

  const attendants = await userRepository.find();

  if (attendants.length === 0) {
    return null;
  }

  let minConversations = Infinity;
  let selectedAttendant: User | null = null;

  //* esse metodo pode ser melhorado, pois vai exigir um processamento muito alto caso tenha muitos users e conversations
  for (const attendant of attendants) {
    const count = await conversationRepository.count({ where: { user: attendant } }); 
    if (count < minConversations) {
      minConversations = count;
      selectedAttendant = attendant;
    }
  }

  return selectedAttendant;
}
