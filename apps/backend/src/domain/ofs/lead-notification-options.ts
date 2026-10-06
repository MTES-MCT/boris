export interface LeadNotificationOptions {
  /** Final flow submission: queue one event only after lead readiness is validated. */
  submitLead?: boolean;
  /** Record a baseline event without emailing historical contacts. */
  suppressLeadNotifications?: boolean;
}
