import { z } from 'zod';

export const PNG_DATA_URL_PREFIX = 'data:image/png;base64,';

export const WebviewBridgeMessageSchema = z.object({
  type: z.literal('share-card'),
  action: z.enum(['share', 'save']),
  dataUrl: z.string().startsWith(PNG_DATA_URL_PREFIX),
});
