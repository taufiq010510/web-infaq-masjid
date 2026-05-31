exports.handler = async (event) => {
  const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRdQdqegMUPU-CvisfxuqU1-cFUqvF4J3swb1bp0i05LrQseLuoRpAX4_UOAq75_t_Z-DDyItWCDb1L/pub?gid=0&single=true&output=csv';

  try {
    const response = await fetch(CSV_URL);
    const text = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: 'Error: ' + err.message,
    };
  }
};