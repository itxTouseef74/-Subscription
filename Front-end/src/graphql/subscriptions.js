// src/graphql/subscriptions.js

import { gql } from '@apollo/client';

export const NEW_SUBSCRIPTION_NOTIFICATION = gql`
  subscription NewSubscriptionNotification {
    newSubscriptionNotification {
      id
      userId
      content
      seen
    }
  }
`;
