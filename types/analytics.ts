export const AnalyticsEventName = {
  TAB_OPEN: 'tab_open',
  UNIVERSITY_SEARCH: 'university_search',
  UNIVERSITY_FILTER_APPLY: 'university_filter_apply',
  UNIVERSITY_DETAIL_OPEN: 'university_detail_open',
  POST_OPEN: 'post_open',
  COMMENT_SUBMIT: 'comment_submit',
  PROFILE_EDIT_SAVE: 'profile_edit_save',
} as const;

export type AnalyticsEventName = (typeof AnalyticsEventName)[keyof typeof AnalyticsEventName];

export type AnalyticsValue = string | number | boolean | null | undefined;

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  payload?: Record<string, AnalyticsValue>;
  timestamp: number;
}
