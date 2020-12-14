import {
    IBotData as IBotDataC, ICarouselButton as ICarouselButtonC, ICarouselItem as ICarouselItemC,
    IConversation as IConversationC, IEmail as IEmailC, IEngageData as IEngageDataC,
    IFacebookComment as IFacebookCommentC, IFacebookPost as IFacebookPostC, IMail as IMailC,
    IMailAttachment as IMailAttachmentC, IMessage as IMessageC, IVideoCallData as IVideoCallDataC
} from 'erxes-ui/lib/inbox/types';
import { QueryResponse } from 'modules/common/types';

export interface IVideoCallData extends IVideoCallDataC { }

export interface IConversation extends IConversationC { };

export interface IFacebookPost extends IFacebookPostC { }

export interface IFacebookComment extends IFacebookCommentC { };

export interface IEmail extends IEmailC { }

export interface IMail extends IMailC { }

export interface IMailAttachment extends IMailAttachmentC { }

export interface IEngageData extends IEngageDataC { }

export interface ICarouselButton extends ICarouselButtonC { }

export interface ICarouselItem extends ICarouselItemC { }

export interface IBotData extends IBotDataC { }

export interface IMessage extends IMessageC { };

// mutation types
export type MarkAsReadMutationResponse = {
  markAsReadMutation: (doc: { variables: { _id: string } }) => Promise<any>;
};

export type ReplyMutationResponse = {
  replyMutation: (doc: {
    variables: AddMessageMutationVariables;
  }) => Promise<any>;
};

export type AddMessageMutationVariables = {
  conversationId: string;
  content: string;
  contentType?: string;
  mentionedUserIds?: string[];
  internal?: boolean;
  attachments?: any;
};

export type AddMessageMutationResponse = {
  addMessageMutation: (doc: {
    variables: AddMessageMutationVariables;
    optimisticResponse: any;
    update: any;
  }) => Promise<any>;
};

export type AssignMutationVariables = {
  conversationIds?: string[];
  assignedUserId: string;
};

export type AssignMutationResponse = {
  assignMutation: (doc: { variables: AssignMutationVariables }) => Promise<any>;
};

export type UnAssignMutationVariables = {
  _ids: string[];
};

export type UnAssignMutationResponse = {
  conversationsUnassign: (doc: {
    variables: UnAssignMutationVariables;
  }) => Promise<any>;
};

export type ChangeStatusMutationVariables = {
  _ids: string[];
  status: boolean;
};

export type ChangeStatusMutationResponse = {
  changeStatusMutation: (doc: {
    variables: ChangeStatusMutationVariables;
  }) => Promise<any>;
};

export type CreateProductBoardMutationVariables = {
  _id: string;
};

export type CreateProductBoardMutationResponse = {
  createProductBoardMutation: (doc: {
    variables: CreateProductBoardMutationVariables;
  }) => Promise<any>;
};

export type ResolveAllMutationVariables = {
  channelId: string;
  status: string;
  unassigned: string;
  awaitingResponse: string;
  brandId: string;
  tag: string;
  integrationType: string;
  participating: string;
  starred: string;
  startDate: string;
  endDate: string;
};

export type ResolveAllMutationResponse = {
  resolveAllMutation: (doc: {
    variables: ResolveAllMutationVariables;
  }) => Promise<any>;
};

// query types
export type ConvesationsQueryVariables = {
  limit: number;
} & ResolveAllMutationVariables;

export type LastConversationQueryResponse = {
  conversationsGetLast: IConversation;
} & QueryResponse;

export type ConversationsQueryResponse = {
  conversations: IConversation[];
  subscribeToMore: (variables) => void;
} & QueryResponse;

export type ConversationDetailQueryResponse = {
  conversationDetail: IConversation;
} & QueryResponse;

export type MessagesQueryResponse = {
  conversationMessages: IMessage[];
  fetchMore: (variables) => void;
} & QueryResponse;

export type MessagesTotalCountQuery = {
  loading: boolean;
  conversationMessagesTotalCount: number;
};

export type ConversationsTotalCountQueryResponse = {
  conversationsTotalCount: number;
} & QueryResponse;

export type UnreadConversationsTotalCountQueryResponse = {
  conversationsTotalUnreadCount: number;
  subscribeToMore: (variables) => void;
} & QueryResponse;

export type FacebookCommentsQueryResponse = {
  converstationFacebookComments: IFacebookComment[];
  fetchMore: (variables) => void;
} & QueryResponse;

export type FacebookCommentsCountQueryResponse = {
  converstationFacebookCommentsCount: any;
  fetchMore: (variables) => void;
} & QueryResponse;

export type ReplyFaceBookCommentMutationVariables = {
  conversationId: string;
  commentId: string;
  content: string;
};

export type ReplyFacebookCommentMutationResponse = {
  replyMutation: (doc: {
    variables: ReplyFaceBookCommentMutationVariables;
  }) => Promise<any>;
};

export type ResolveFacebookCommentMutationVariables = {
  commentId: string;
};

export type ResolveFacebookCommentResponse = {
  resolveMutation: (doc: {
    variables: ResolveFacebookCommentMutationVariables;
  }) => Promise<any>;
};
