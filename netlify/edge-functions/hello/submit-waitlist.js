export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE_ID = "appb5sArZvUn7hOrF";           // ← ton vrai Base ID
  const TABLE = "Waitlist";

  try {
    const { name, email, ...answers } = req.body;

    const response = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            "Prénom": name,
            "Email": email,
            "Situation": answers.q1 || "",
            "Problème": answers.q2 || "",
            "Temps/semaine": answers.q3 || "",
            "Outils actuels": answers.q4 || "",
            "Budget": answers.q5 || "",
            "Modèle préféré": answers.q6 || "",
            "Feature clé": answers.q7 || "",
            "Date": new Date().toISOString(),
          },
        }),
      }
    );

    if (!response.ok) throw new Error("Erreur Airtable");

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur lors de l'envoi" });
  }
}