import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';

initializeApp();

const db = getFirestore();
const ALERT_EMAIL = 'ajxfitclub@gmail.com';

const formatLeadTime = (timestamp) => {
  const date = timestamp?.toDate ? timestamp.toDate() : new Date();

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata'
  }).format(date);
};

export const sendLeadAlertEmail = onDocumentCreated(
  {
    document: 'landingLeads/{leadId}',
    region: 'asia-south1'
  },
  async (event) => {
    const lead = event.data?.data();

    if (!lead) {
      return;
    }

    const leadId = event.params.leadId;
    const name = lead.name || 'Unknown';
    const phone = lead.phone || 'Not provided';
    const planName = lead.planName || 'Unknown plan';
    const planPrice = lead.planPrice || '';
    const planPeriod = lead.planPeriod || '';
    const createdAt = formatLeadTime(lead.createdAt);

    await db.collection('mail').add({
      to: [ALERT_EMAIL],
      message: {
        subject: `New AJX Lead - ${planName}`,
        text: [
          'New AJX FitClub lead',
          '',
          `Name: ${name}`,
          `Phone: ${phone}`,
          `Plan: ${planName}`,
          `Price: ${planPrice} ${planPeriod}`.trim(),
          `Source: ${lead.source || 'landing_plan_card'}`,
          `Submitted: ${createdAt}`,
          '',
          `Firestore lead ID: ${leadId}`
        ].join('\n')
      },
      leadId,
      createdAt: FieldValue.serverTimestamp()
    });
  }
);
