const STORAGE_KEY = 'lhm_settings';

export const DEFAULT_SETTINGS = {
  notifications: { criticalAlert: true, checkupReminder: true, predictionAlert: true },
  animals:       { defaultSort: 'checkup_asc', defaultStatus: '' },
  dashboard:     { defaultFilter: '', refetchOnFocus: true },
  reports:       { showUpcomingCheckups: true, showSpeciesChart: true, showHealthPie: true },
  display:       { dateFormat: 'en-IN' },
};

export const getSettings = () => {
  try { return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) }; }
  catch { return DEFAULT_SETTINGS; }
};
