import strip from 'strip';
import mongoose from 'mongoose';
import { Conversations } from './';
import { field } from './utils';

const FacebookSchema = mongoose.Schema(
  {
    postId: field({
      type: String,
      optional: true,
    }),

    commentId: field({
      type: String,
      optional: true,
    }),

    parentId: field({
      type: String,
      optional: true,
    }),

    // messenger message id
    messageId: field({
      type: String,
      optional: true,
    }),

    // comment, reaction, etc ...
    item: field({
      type: String,
      optional: true,
    }),

    // when share photo
    photoId: field({
      type: String,
      optional: true,
    }),

    // when share video
    videoId: field({
      type: String,
      optional: true,
    }),

    link: field({
      type: String,
      optional: true,
    }),

    reactionType: field({
      type: String,
      optional: true,
    }),

    senderId: field({
      type: String,
      optional: true,
    }),

    senderName: field({
      type: String,
      optional: true,
    }),
  },
  { _id: false },
);

const TwitterSchema = mongoose.Schema(
  {
    id: field({
      type: String,
      optional: true,
    }),
  },
  { _id: false },
);

const MessageSchema = mongoose.Schema({
  _id: field({ pkey: true }),
  content: field({ type: String }),
  attachments: field({ type: Object }),
  mentionedUserIds: field({ type: [String] }),
  conversationId: field({ type: String }),
  internal: field({ type: Boolean }),
  customerId: field({ type: String }),
  userId: field({ type: String }),
  createdAt: field({ type: Date }),
  isCustomerRead: field({ type: Boolean }),
  engageData: field({ type: Object }),
  formWidgetData: field({ type: Object }),
  facebookData: field({ type: FacebookSchema }),
  twitterData: field({ type: TwitterSchema }),
});

class Message {
  /**
   * Create a message
   * @param  {Object} messageObj - object
   * @return {Promise} Newly created message object
   */
  static async createMessage(doc) {
    const message = await this.create({
      internal: false,
      ...doc,
      createdAt: new Date(),
    });

    const messageCount = await this.find({
      conversationId: message.conversationId,
    }).count();

    await Conversations.update(
      { _id: message.conversationId },
      {
        $set: {
          messageCount,

          // updating updatedAt
          updatedAt: new Date(),
        },
      },
    );

    // add created user to participators
    await Conversations.addParticipatedUsers(message.conversationId, message.userId);

    // add mentioned users to participators
    for (let userId of message.mentionedUserIds) {
      await Conversations.addParticipatedUsers(message.conversationId, userId);
    }

    return message;
  }

  /**
   * Create a conversation message
   * @param  {Object} doc - Conversation message fields
   * @param  {Object} user - Object
   * @return {Promise} Newly created conversation object
   */
  static async addMessage(doc, userId) {
    const conversation = await Conversations.findOne({ _id: doc.conversationId });

    if (!conversation) throw new Error(`Conversation not found with id ${doc.conversationId}`);

    // normalize content, attachments
    const content = doc.content || '';
    const attachments = doc.attachments || [];

    doc.content = content;
    doc.attachments = attachments;

    // if there is no attachments and no content then throw content required error
    if (attachments.length === 0 && !strip(content)) throw new Error('Content is required');

    // setting conversation's content to last message
    await Conversations.update({ _id: doc.conversationId }, { $set: { content } });

    return this.createMessage({ ...doc, userId });
  }

  /**
   * Remove a messages
   * @param  {Object} selector
   * @return {Promise} Deleted messages info
   */
  static async removeMessages(selector) {
    const messages = await this.find(selector);
    const result = await this.remove(selector);

    for (let message of messages) {
      const messageCount = await Messages.find({
        conversationId: message.conversationId,
      }).count();

      await Conversations.update({ _id: message.conversationId }, { $set: { messageCount } });
    }

    return result;
  }

  /**
  * User's last non answered question
  * @param  {String} conversationId
  * @return {Promise} Message object
  */
  static getNonAsnweredMessage(conversationId) {
    return this.findOne({
      conversationId: conversationId,
      customerId: { $exists: true },
    }).sort({ createdAt: -1 });
  }

  /**
   * Get admin messages
   * @param  {String} conversationId
   * @return {Promise} messages
   */
  static getAdminMessages(conversationId) {
    return this.find({
      conversationId: conversationId,
      userId: { $exists: true },
      isCustomerRead: false,

      // exclude internal notes
      internal: false,
    }).sort({ createdAt: 1 });
  }

  /**
   * Mark sent messages as read
   * @param  {String} conversationId
   * @return {Promise} Updated messages info
   */
  static markSentAsReadMessages(conversationId) {
    return this.update(
      {
        conversationId: conversationId,
        userId: { $exists: true },
        isCustomerRead: { $exists: false },
      },
      { $set: { isCustomerRead: true } },
      { multi: true },
    );
  }

  /**
   * Transfers customers' conversation messages to another customer
   * @param  {String} newCustomerId - Customer id to set
   * @param  {String[]} customerIds - Old customer ids to change
   * @return {Promise} Updated list of conversation messages of new customer
   */
  static async changeCustomer(newCustomerId, customerIds) {
    for (let customerId of customerIds) {
      // Updating every conversation message of old customer
      await this.updateMany({ customerId: customerId }, { $set: { customerId: newCustomerId } });
    }
    // Returning updated list of conversation messages of new customer
    return this.find({ customerId: newCustomerId });
  }

  /**
   * Removing customer conversation messages
   * @param {String} customerId - Customer id of customer to remove
   * @return {Promise} Result
   */
  static async removeCustomerConversationMessages(customerId) {
    // Removing every conversation messages of customer
    return await this.remove({
      customerId,
    });
  }
}

MessageSchema.loadClass(Message);

const Messages = mongoose.model('conversation_messages', MessageSchema);

export default Messages;
