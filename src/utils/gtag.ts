export const GA_TRACKING_ID = 'G-4REE3VBPH3';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  window?.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

interface Event {
  action: string;
  category?: string;
  label?: string;
  value?: string;
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = (params: Event) => {
  if (typeof window !== 'undefined') {
    try {
      window?.gtag('event', params.action, {
        event_category: params?.category,
        event_label: params?.label,
        value: params?.value,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('errr');
    }
  }
};
