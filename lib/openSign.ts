// utils/openSign.ts
export async function sendToOpenSign(pdfBuffer: Buffer, customerEmail: string, businessName: string, customerName: string): Promise<{url: string, documentId: string}> {
    const OPEN_SIGN_API_KEY = process.env.OPEN_SIGN_API_KEY;
    if (!OPEN_SIGN_API_KEY) {
      throw new Error('OpenSign API key is missing');
    }
  
    // Encode the PDF buffer to base64
    const base64Pdf = pdfBuffer.toString('base64');
  
    // Construct the JSON payload based on the OpenSign API example
    const payload = {
      file: base64Pdf, // Base64 encoded PDF
      title: `Waiver for ${customerName}`, // Example title
      note: "Please review and sign the attached waiver.", // Example note
      description: "Waiver required for booking.", // Example description
      timeToCompleteDays: 7, // Example completion time
      signer: {
        role: "customer",
        email: customerEmail,
        name: customerName, 
        widgets: [
          {
            type: "signature",
            page: 2,
            x: 63,
            y: 265,
            w: 165,
            h: 45
          },
          {
            type: "date",
            page: 2,
            x: 320,
            y: 282,
            w: 123,
            h: 29,
            options: {
              required: true,
              name: "date",
              default: "04-30-2025", 
              format: "mm-dd-yyyy",
              color: "black",
              fontsize: 12
            }
          },
          {
            type: "name",
            page: 2,
            x: 44,
            y: 342,
            w: 137,
            h: 34,
            options: {
              required: true,
              name: "name",
              color: "black",
              fontsize: 12
            }
          },
          {
            type: "textbox",
            page: 2,
            x: 315,
            y: 339,
            w: 150,
            h: 39,
            options: {
              name: "number",
              required: true,
              default: "1234567890",
              hint: "Please enter your phone number",
              color: "black",
              fontsize: 12,
            }
          } 
        ],
      },
      sender_name: businessName,
      send_email: false,
    };
  
    // Use the SelfSign endpoint with JSON payload
    const response = await fetch('https://opensign-w6plx.ondigitalocean.app/app/selfsign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-token': OPEN_SIGN_API_KEY,
      },
      body: JSON.stringify(payload), // Send the JSON payload
    });
  
    if (!response.ok) {
      const errorBody = await response.text(); // Get more details on error
      console.error(`OpenSign API error response: ${errorBody}`);
      throw new Error(`OpenSign API error: ${response.status} - ${response.statusText}`);
    }
  
    const data = await response.json();
    return { url: data.signurl, documentId: data.objectId }; 
}


  