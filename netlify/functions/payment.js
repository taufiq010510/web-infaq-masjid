exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;

  if (!MIDTRANS_SERVER_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server key tidak ditemukan." }),
    };
  }

  try {
    const { nama, email, telepon, program, nominal } = JSON.parse(event.body);
    const orderId = "wakaf-" + Date.now();

    const transactionData = {
      transaction_details: {
        order_id: orderId,
        gross_amount: parseInt(nominal),
      },
      customer_details: {
        first_name: nama,
        email: email,
        phone: telepon,
      },
      item_details: [
        {
          id: "wakaf-001",
          price: parseInt(nominal),
          quantity: 1,
          name: program || "Wakaf Tanah",
        },
      ],
      callbacks: {
        finish: "https://DOMAIN-ANDA.netlify.app/terima-kasih.html",
      },
    };

    const response = await fetch(
      "https://app.sandbox.midtrans.com/snap/v1/transactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(MIDTRANS_SERVER_KEY + ":").toString("base64"),
        },
        body: JSON.stringify(transactionData),
      }
    );

    const result = await response.json();

    if (result.token) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: result.token, orderId }),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Gagal membuat transaksi", detail: result }),
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};