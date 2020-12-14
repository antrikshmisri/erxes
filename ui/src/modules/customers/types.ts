import {
  IVisitorContact as IVisitorContactC,
  ICustomerLinks as ICustomerLinksC,
  ICustomerDoc as ICustomerDocC,
  IUrlVisits as IUrlVisitsC,
  ICustomer as ICustomerC
} from 'erxes-ui/lib/types'
import { ActivityLogQueryResponse as ActivityLogQueryResponseC } from 'erxes-ui/lib/activityLogs/types';
import { QueryResponse } from 'modules/common/types';

export interface IVisitorContact extends IVisitorContactC { }

export interface ICustomerLinks extends ICustomerLinksC { }

export interface ICustomerDoc extends ICustomerDocC { }

export interface IUrlVisits extends IUrlVisitsC { }

export interface ICustomer extends ICustomerC { }

// mutation types

export type AddMutationResponse = {
  customersAdd: (params: { variables: ICustomerDoc }) => Promise<any>;
};

export type EditMutationResponse = {
  customersEdit: (doc: { variables: ICustomer }) => Promise<any>;
};

export type RemoveMutationVariables = {
  customerIds: string[];
};

export type RemoveMutationResponse = {
  customersRemove: (doc: {
    variables: RemoveMutationVariables;
  }) => Promise<any>;
};

export type MergeMutationVariables = {
  customerIds: string[];
  customerFields: ICustomer;
};

export type VerifyMutationVariables = {
  verificationType: string;
};

export type VerifyMutationResponse = {
  customersVerify: (doc: {
    variables: VerifyMutationVariables;
  }) => Promise<any>;
};

export type MergeMutationResponse = {
  customersMerge: (doc: { variables: MergeMutationVariables }) => Promise<any>;
};

export type ChangeStateMutationVariables = {
  _id: string;
  value: string;
};

export type ChangeStateMutationResponse = {
  customersChangeState: (doc: {
    variables: ChangeStateMutationVariables;
  }) => Promise<any>;
};

export type ChangeStatusMutationVariables = {
  customerIds: string[];
  type: string;
  status: string;
};

export type ChangeStatusMutationResponse = {
  customersChangeVerificationStatus: (doc: {
    variables: ChangeStatusMutationVariables;
  }) => Promise<any>;
};

// query types
export type ListQueryVariables = {
  page?: number;
  perPage?: number;
  segment?: string;
  tag?: string;
  ids?: string;
  searchValue?: string;
  brand?: string;
  integration?: string;
  form?: string;
  startDate?: string;
  endDate?: string;
  leadStatus?: string;
  sortField?: string;
  sortDirection?: number;
};

export type MainQueryResponse = {
  customersMain: { list: ICustomer[]; totalCount: number };
} & QueryResponse;

type CountResponse = {
  [key: string]: number;
};

type CustomerCounts = {
  byBrand: CountResponse;
  byForm: CountResponse;
  byIntegrationType: CountResponse;
  byLeadStatus: CountResponse;
  bySegment: CountResponse;
  byTag: CountResponse;
};

export type CustomersQueryResponse = {
  customers: ICustomer[];
} & QueryResponse;

export type CountQueryResponse = {
  customerCounts: CustomerCounts;
} & QueryResponse;

export type CustomerDetailQueryResponse = {
  customerDetail: ICustomer;
  loading: boolean;
};

export type ActivityLogQueryResponse = ActivityLogQueryResponseC;
