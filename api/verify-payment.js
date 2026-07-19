export default async function handler(req, res) {
  const { reference } = req.query;
  if (!reference) {
    return res.status(400).json({ error: "Missing reference" });
  }

  try {
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
    );
    const data = await paystackRes.json();

    const verified = data.status && data.data?.status === "success";
    return res.status(200).json({ verified });
  } catch (err) {
    console.error("Paystack verify error:", err);
    return res.status(500).json({ error: "Server error verifying payment" });
  }
}