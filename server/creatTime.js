// addParkingsToDB.js
const axios = require('axios');
const { Parking } = require('./models/Parking'); // התאימי את הנתיב למודל שלך
const { getCoordinatesFromAddress, haversineDistance } = require('./utils/utils');
const addresses = [
  " בן יהודה 10, תל אביב",
  "שדרות רוטשילד 5, תל אביב",
  "רחוב יפו 50, ירושלים",
  "כיכר ספרא, ירושלים",
  "רחוב נמל 8, חיפה",
  "מרכז מסחרי סי מול, חיפה",
  "כיכר העצמאות, ראשון לציון",
  "רחוב הרצל 14, פתח תקווה",
  "כיכר דניה, רמת גן",
  "רחוב הירקון 22, תל אביב",
  "רחוב המלך ג'ורג' 30, ירושלים",
  "כיכר אתרים, ירושלים",
  "רחוב הצבי 3, חיפה",
  "רחוב הרצל 25, באר שבע",
  "שדרות בן גוריון 7, נתניה",
  "כיכר המדינה, תל אביב",
  "רחוב רוטשילד 40, ראשון לציון",
  "רחוב השומר 2, חיפה",
  "רחוב קפלן 8, תל אביב",
  "מרכז קניות עזריאלי, תל אביב",
  "רחוב כצנלסון 12, תל אביב",
  "רחוב מנחם בגין 17, ירושלים",
  "כיכר ציון, ירושלים",
  "רחוב הירדן 5, חיפה",
  "רחוב המסגר 20, תל אביב",
  "כיכר רבין, תל אביב",
  "רחוב המלך דוד 15, ירושלים",
  "רחוב העצמאות 6, באר שבע",
  "שדרות הנשיא 4, תל אביב",
  "רחוב אלנבי 7, תל אביב",
  "רחוב יקותיאל 10, חיפה",
  "רחוב קינג ג'ורג' 14, תל אביב",
  "כיכר רבין, ראשון לציון",
  "רחוב הסולל 18, רעננה",
  "רחוב הרצל 3, אשדוד",
  "כיכר השעון, צפת",
  "רחוב משה דיין 12, אשקלון",
  "רחוב יהודה הלוי 6, נתניה",
  "רחוב המלאכה 5, חולון",
  "רחוב יצחק שדה 10, ראשון לציון",
  "רחוב שפרינצק 8, ירושלים",
  "רחוב הרצל 22, חיפה",
  "רחוב העצמאות 9, נתניה",
  "שדרות רוטשילד 21, תל אביב",
  "רחוב יוסף נבו 3, פתח תקווה",
  "כיכר הבימה, תל אביב",
  "רחוב ההסתדרות 11, חולון"
];



// פונקציה להוספת חניה למסד
async function addParking(address) {
  try {
    const coords = await getCoordinatesFromAddress(address);

    // בודק אם כבר קיימת חניה עם הכתובת הזו (אפשר לשנות לשדות אחרים)
    const existing = await Parking.findOne({ where: { address } });
    if (existing) {
      console.log(`Parking already exists for address: ${address}`);
      return;
    }

    // הוספת חניה חדשה
    await Parking.create({
      address,
      latitude: coords.latitude,
      longitude: coords.longitude,
      ownerId: 1, // <<== שימי פה את ה-ID של משתמש קיים
      description: "חניה ציבורית באזור מרכזי",
      imageUrl: null // או הכניסי כתובת תמונה אם יש
    });

    console.log(`Added parking at: ${address}`);
  } catch (error) {
    console.error(`Failed to add parking for address: ${address}`, error.message);
  }
}

async function main() {
  for (const address of addresses) {
    await addParking(address);
  }
  console.log('Finished adding all parkings.');
}

// להריץ רק אם קובץ זה הוא הקובץ הראשי
if (require.main === module) {
  main();
}

module.exports = { addParking, getCoordinatesFromAddress };
