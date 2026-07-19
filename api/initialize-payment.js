export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, amount, reference, metadata } = req.body || {};
  if (!email || !amount || !reference) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const origin = req.headers.origin || `https://${req.headers.host}`;

    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount, // already in kobo from the client
        currency: "NGN",
        reference,
        metadata,
        callback_url: `${origin}/`, // Paystack redirects back here with ?reference=
      }),
    });

    const data = await paystackRes.json();
    if (!data.status) {
      return res.status(400).json({ error: data.message || "Could not initialize transaction" });
    }

    return res.status(200).json({ authorization_url: data.data.authorization_url });
  } catch (err) {
    console.error("Paystack initialize error:", err);
    return res.status(500).json({ error: "Server error initializing payment" });
  }
}