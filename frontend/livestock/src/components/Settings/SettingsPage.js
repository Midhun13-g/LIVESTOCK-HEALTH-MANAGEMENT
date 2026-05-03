import React, { useState } from 'react';
import './SettingsPage.css';

const DEFAULT = {
  notifications: {
    criticalAlert: true,
    checkupReminder: true,
    predictionAlert: true,
  },
  animals: {
    defaultSort: 'checkup_asc',
    defaultStatus: '',
  },
  dashboard: {
    defaultFilter: '',
    refetchOnFocus: true,
  },
  reports: {
    showUpcomingCheckups: true,
    showSpeciesChart: true,
    showHealthPie: true,
  },
  display: {
    dateFormat: 'en-IN',
  },
};

const STORAGE_KEY = 'lhm_settings';

const load = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT; }
  catch { return DEFAULT; }
};

const SettingsPage = () => {
  const [s, setS] = useState(load);
  const [saved, setSaved] = useState(false);

  const toggle = (section, key) =>
    setS(prev => ({ ...prev, [section]: { ...prev[section], [key]: !prev[section][key] } }));

  const set = (section, key, val) =>
    setS(prev => ({ ...prev, [section]: { ...prev[section], [key]: val } }));

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const reset = () => { setS(DEFAULT); localStorage.removeItem(STORAGE_KEY); };

  return (
    <div className="sp-page">
      <div className="sp-header">
        <h2>Settings</h2>
        <p>Configure your Livestock Health Management preferences</p>
      </div>

      {/* Notifications */}
      <div className="sp-section">
        <h3>🔔 Notifications</h3>
        <div className="sp-rows">
          {[
            { key: 'criticalAlert',    label: 'Critical Status Alerts',     desc: 'Alert when an animal is marked critical' },
            { key: 'checkupReminder',  label: 'Checkup Reminders',          desc: 'Remind about upcoming animal checkups' },
            { key: 'predictionAlert',  label: 'Disease Prediction Alerts',  desc: 'Alert on high-risk disease predictions' },
          ].map(({ key, label, desc }) => (
            <div className="sp-row" key={key}>
              <div>
                <span className="sp-label">{label}</span>
                <span className="sp-desc">{desc}</span>
              </div>
              <label className="sp-switch">
                <input type="checkbox" checked={s.notifications[key]} onChange={() => toggle('notifications', key)} />
                <span className="sp-slider" />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Animals */}
      <div className="sp-section">
        <h3>🐄 Animals Page</h3>
        <div className="sp-rows">
          <div className="sp-row">
            <div>
              <span className="sp-label">Default Sort</span>
              <span className="sp-desc">How animals are sorted when the page loads</span>
            </div>
            <select value={s.animals.defaultSort} onChange={e => set('animals', 'defaultSort', e.target.value)}>
              <option value="checkup_asc">Checkup Date ↑</option>
              <option value="checkup_desc">Checkup Date ↓</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
          <div className="sp-row">
            <div>
              <span className="sp-label">Default Status Filter</span>
              <span className="sp-desc">Pre-filter animals by health status</span>
            </div>
            <select value={s.animals.defaultStatus} onChange={e => set('animals', 'defaultStatus', e.target.value)}>
              <option value="">All Animals</option>
              <option value="healthy">Healthy</option>
              <option value="treatment">Treatment</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dashboard */}
      <div className="sp-section">
        <h3>🏠 Dashboard</h3>
        <div className="sp-rows">
          <div className="sp-row">
            <div>
              <span className="sp-label">Default Status Filter</span>
              <span className="sp-desc">Pre-filter dashboard cards by health status</span>
            </div>
            <select value={s.dashboard.defaultFilter} onChange={e => set('dashboard', 'defaultFilter', e.target.value)}>
              <option value="">All Animals</option>
              <option value="healthy">Healthy</option>
              <option value="treatment">Treatment</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="sp-row">
            <div>
              <span className="sp-label">Refetch on Tab Focus</span>
              <span className="sp-desc">Reload animal data when you switch back to the app</span>
            </div>
            <label className="sp-switch">
              <input type="checkbox" checked={s.dashboard.refetchOnFocus} onChange={() => toggle('dashboard', 'refetchOnFocus')} />
              <span className="sp-slider" />
            </label>
          </div>
        </div>
      </div>

      {/* Reports */}
      <div className="sp-section">
        <h3>📊 Reports</h3>
        <div className="sp-rows">
          {[
            { key: 'showHealthPie',        label: 'Health Status Chart',    desc: 'Show pie chart of health distribution' },
            { key: 'showSpeciesChart',     label: 'Species Bar Chart',      desc: 'Show bar chart of animals by species' },
            { key: 'showUpcomingCheckups', label: 'Upcoming Checkups Table',desc: 'Show upcoming checkup schedule table' },
          ].map(({ key, label, desc }) => (
            <div className="sp-row" key={key}>
              <div>
                <span className="sp-label">{label}</span>
                <span className="sp-desc">{desc}</span>
              </div>
              <label className="sp-switch">
                <input type="checkbox" checked={s.reports[key]} onChange={() => toggle('reports', key)} />
                <span className="sp-slider" />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Display */}
      <div className="sp-section">
        <h3>🖥️ Display</h3>
        <div className="sp-rows">
          <div className="sp-row">
            <div>
              <span className="sp-label">Date Format</span>
              <span className="sp-desc">How dates are displayed across the app</span>
            </div>
            <select value={s.display.dateFormat} onChange={e => set('display', 'dateFormat', e.target.value)}>
              <option value="en-IN">DD MMM YYYY (en-IN)</option>
              <option value="en-US">MM/DD/YYYY (en-US)</option>
              <option value="en-GB">DD/MM/YYYY (en-GB)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="sp-footer">
        <button className="sp-btn-reset" onClick={reset}>Reset to Defaults</button>
        <button className="sp-btn-save" onClick={save}>{saved ? '✓ Saved!' : 'Save Settings'}</button>
      </div>
    </div>
  );
};

export default SettingsPage;
