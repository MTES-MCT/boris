import translations from '../utils/translations';

export type FlashMessage = {
  type: 'error' | 'success';
  message: string;
};

export class FlashMessageFactory {
  public static createFlashMessage({ type, message }: FlashMessage) {
    return {
      type: translations[type].label || '',
      message,
    };
  }
}
