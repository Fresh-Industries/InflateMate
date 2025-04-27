// WaiverDocument.tsx  –  full version with DocuSeal tags
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import React from 'react';

/* ------------- type defs (unchanged) ------------- */
interface Customer { id: string; name: string; email: string; phone: string; }
interface Business { id: string; name: string; logo?: string | null; phone?: string | null; email?: string | null; }
interface Booking { id: string; eventDate: string; eventAddress: string; eventCity: string; eventState: string; eventZipCode: string; participantCount: number; participantAge?: number; }
interface WaiverDocumentProps { business: Business; customer: Customer; booking: Booking; templateVersion: string; }

/* ------------- styles (unchanged) ------------- */
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 12, color: '#000' },
  header: { alignItems: 'center', marginBottom: 30 },
  logo: { width: 80, height: 80, marginBottom: 15, objectFit: 'contain' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  metadata: { fontSize: 10, color: '#666' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  paragraph: { marginBottom: 10, lineHeight: 1.5, textAlign: 'justify' },
  signatureBlock: { marginTop: 40, borderTopWidth: 1, borderTopColor: '#ccc', paddingTop: 30 },
  signatureLine: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  signatureField: { flex: 1, marginRight: 20 },
  signatureBorder: { borderBottomWidth: 1, borderBottomColor: '#000', marginBottom: 5, minHeight: 30 },
  signatureLabel: { fontSize: 10 },
  footer: { position: 'absolute', bottom: 30, left: 0, right: 0, textAlign: 'center', fontSize: 10, color: '#666' },
});

/* ------------- component ------------- */
export default function WaiverDocument({ business, customer, booking, templateVersion }: WaiverDocumentProps) {
  const today = new Date().toLocaleDateString();
  const eventDateObj = new Date(booking.eventDate);
  const displayEventDate = !isNaN(eventDateObj.getTime()) ? eventDateObj.toLocaleDateString() : 'Invalid Date';

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* ---------- HEADER ---------- */}
        <View style={styles.header}>
          {business.logo?.trim() && <Image src={business.logo!} style={styles.logo} />}
          <Text style={styles.title}>{business.name}</Text>
          <Text style={styles.subtitle}>Waiver and Release of Liability</Text>
          <Text style={styles.metadata}>Version: {templateVersion}</Text>
          <Text style={styles.metadata}>Date: {today}</Text>
        </View>

        {/* ---------- CONTENT ---------- */}
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            I, <Text style={{ fontWeight: 'bold' }}>{customer.name}</Text>, hereby agree to the following:
          </Text>
        </View>

        {/* Event details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Details:</Text>
          <Text style={styles.paragraph}>Date: {displayEventDate}</Text>
          <Text style={styles.paragraph}>
            Location: {booking.eventAddress}, {booking.eventCity}, {booking.eventState} {booking.eventZipCode}
          </Text>
          <Text style={styles.paragraph}>Number of Participants: {booking.participantCount}</Text>
          {booking.participantAge && <Text style={styles.paragraph}>Age of Participants: {booking.participantAge}</Text>}
        </View>

        {/* Waiver clauses (unchanged) */}
        {/* … [redacted here for brevity but leave as-is in your file] … */}

        {/* ---------- SIGNATURE LINES (visual) ---------- */}
        <View style={styles.signatureBlock}>
          <View style={styles.signatureLine}>
            <View style={styles.signatureField}>
              <View style={styles.signatureBorder} />
              <Text style={styles.signatureLabel}>Signature of Participant/Guardian</Text>
            </View>
            <View style={styles.signatureField}>
              <View style={styles.signatureBorder} />
              <Text style={styles.signatureLabel}>Date</Text>
            </View>
          </View>
          <View style={styles.signatureLine}>
            <View style={styles.signatureField}>
              <View style={styles.signatureBorder} />
              <Text style={styles.signatureLabel}>Print Name</Text>
            </View>
            <View style={styles.signatureField}>
              <View style={styles.signatureBorder} />
              <Text style={styles.signatureLabel}>Emergency Contact Phone</Text>
            </View>
          </View>
        </View>

        {/* ---------- INVISIBLE DocuSeal TAGS ---------- */}
        {/* Signature */}
        <Text
          style={{ position: 'absolute', top: 560, left: 45, opacity: 0 }}
        >
          {`{{Signature;role=customer;type=signature}}`}
        </Text>
        {/* Date */}
        <Text
          style={{ position: 'absolute', top: 560, left: 330, opacity: 0 }}
        >
          {`{{Date;role=customer;type=date}}`}
        </Text>
        {/* Name */}
        <Text
          style={{ position: 'absolute', top: 615, left: 45, opacity: 0 }}
        >
          {`{{Name;role=customer;type=text}}`}
        </Text>
        {/* Phone */}
        <Text
          style={{ position: 'absolute', top: 615, left: 330, opacity: 0 }}
        >
          {`{{Phone;role=customer;type=phone}}`}
        </Text>

        {/* ---------- FOOTER ---------- */}
        <View style={styles.footer}>
          <Text>{business.name}</Text>
          {(business.phone || business.email) && (
            <Text>
              {business.phone ? `Phone: ${business.phone}` : ''}
              {business.phone && business.email ? ' | ' : ''}
              {business.email ? `Email: ${business.email}` : ''}
            </Text>
          )}
        </View>
      </Page>
    </Document>
  );
}
