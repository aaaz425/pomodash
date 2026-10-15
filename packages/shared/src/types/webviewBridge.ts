export type ShareCardAction = 'share' | 'save';

export interface ShareCardBridgeMessage {
  type: 'share-card';
  action: ShareCardAction;
  dataUrl: string;
}

export type WebviewBridgeMessage = ShareCardBridgeMessage;
