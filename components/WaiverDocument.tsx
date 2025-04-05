import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Business {
  id: string;
  name: string;
  logo?: string | null;
  phone?: string | null;
  email?: string | null;
}

interface Booking {
  id: string;
  eventDate: string;
  eventAddress: string;
  eventCity: string;
  eventState: string;
  eventZipCode: string;
  participantCount: number;
  participantAge?: number;
}

interface WaiverDocumentProps {
  business: Business;
  customer: Customer;
  booking: Booking;
  templateVersion: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 12,
    color: '#000000'
  },
  header: {
    alignItems: 'center',
    marginBottom: 30
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 15,
    objectFit: 'contain'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15
  },
  metadata: {
    fontSize: 10,
    color: '#666666'
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8
  },
  paragraph: {
    marginBottom: 10,
    lineHeight: 1.5,
    textAlign: 'justify'
  },
  signatureBlock: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    paddingTop: 30
  },
  signatureLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  signatureField: {
    flex: 1,
    marginRight: 20
  },
  signatureBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    marginBottom: 5,
    minHeight: 30
  },
  signatureLabel: {
    fontSize: 10
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: '#666666'
  }
});

export default function WaiverDocument({
  business,
  customer,
  booking,
  templateVersion
}: WaiverDocumentProps) {
  const today = new Date().toLocaleDateString();

  // Check for valid date
  const eventDateObj = new Date(booking.eventDate);
  const isValidDate = !isNaN(eventDateObj.getTime());
  const displayEventDate = isValidDate ? eventDateObj.toLocaleDateString() : 'Invalid Date';

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {/* Only render Image if logo is a non-empty string */}
          {business.logo && typeof business.logo === 'string' && business.logo.trim() !== '' && (
            <Image src={business.logo} style={styles.logo} />
          )}
          <Text style={styles.title}>{business.name}</Text>
          <Text style={styles.subtitle}>Waiver and Release of Liability</Text>
          <Text style={styles.metadata}>Version: {templateVersion}</Text>
          <Text style={styles.metadata}>Date: {today}</Text>
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            I, <Text style={{ fontWeight: 'bold' }}>{customer.name}</Text>, hereby agree to the following:
          </Text>
        </View>
        
        {/* Event Details */}
        {booking && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Event Details:</Text>
            <Text style={styles.paragraph}>Date: {displayEventDate}</Text>
            <Text style={styles.paragraph}>
              Location: {booking.eventAddress}, {booking.eventCity}, {booking.eventState} {booking.eventZipCode}
            </Text>
            <Text style={styles.paragraph}>Number of Participants: {booking.participantCount}</Text>
            {booking.participantAge && (
              <Text style={styles.paragraph}>Age of Participants: {booking.participantAge}</Text>
            )}
          </View>
        )}

        {/* Waiver Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Assumption of Risk</Text>
          <Text style={styles.paragraph}>
            I understand and acknowledge that the activities provided by {business.name} involve inherent risks, 
            including but not limited to physical injury, and I voluntarily assume all such risks.
          </Text>

          <Text style={styles.sectionTitle}>2. Release of Liability</Text>
          <Text style={styles.paragraph}>
            I hereby release and hold harmless {business.name}, its owners, operators, employees, and agents 
            from any and all claims, demands, or causes of action which are in any way connected with my 
            participation in these activities.
          </Text>

          <Text style={styles.sectionTitle}>3. Indemnification</Text>
          <Text style={styles.paragraph}>
            I agree to indemnify and defend {business.name} against all claims, causes of action, damages, 
            judgments, costs or expenses, including attorney fees and other litigation costs.
          </Text>

          <Text style={styles.sectionTitle}>4. Medical Authorization</Text>
          <Text style={styles.paragraph}>
            In the event of an emergency, I authorize {business.name} to secure from any licensed hospital, 
            physician, or medical personnel any treatment deemed necessary for immediate care.
          </Text>
        </View>

        {/* Signature Block */}
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

        <View style={styles.footer}>
          <Text>{business.name}</Text>
          {/* Conditionally render phone and email */}
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