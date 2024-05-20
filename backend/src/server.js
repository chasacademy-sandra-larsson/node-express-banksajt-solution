import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

// Initiera vår express-app
const app = express();
// Definera den port vi vill använda för vår server
const port = 3000;

// Middleware (vi går in på vad just middleware är senare i kursen - just här för cors och hantera parsa data som skickas med body)
app.use(cors());
app.use(bodyParser.json());


// Generera engångslösenord
function generateOTP() {
    // Generera en sexsiffrig numerisk OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
}

// Din kod här. Skriv dina arrayer
const users = [];
const accounts = [];
const sessions = [];


// Logga users, accounts, and sessions. Anropa i respektive routes för att kogga ut information
function logCurrentData() {
    console.log('Users:', users);
    console.log('Accounts:', accounts);
    console.log('Sessions:', sessions); 
}

// Din kod här. Skriv dina routes:

// Route för att skapa en användare
app.post('/users', (req, res) => {
    
    // Hämta användarnamn och lösenord från förfrågans body
    const { username, password } = req.body;

    // Skapa ny användare
    const newUser = {
        id: users.length + 1,
        username,
        password,
    };

    // Lägga till nu användare till arrayen "users".
    users.push(newUser);

    // Skapa nytt konto. userId är relationen till den användare som precis skapats.
    // Saldo är 0 från start.
    const newAccount = {
        id: accounts.length + 1,
        userId: newUser.id,
        balance: 0,
    };

    // Lägg till nytt konto till arrayen "accounts"
    accounts.push(newAccount);

    // Logga data 
    logCurrentData();

    // Svaret skickas till klienten 
   res.status(201).json({user: newUser, account: newAccount});

});

// Route för att logga in
app.post('/sessions', (req, res) => {
    
     // Hämta användarnamn och lösenord från förfrågans body
    const { username, password } = req.body;

    // Hitta användaren i users-arrayen som matchar användarnamn och lösenord
    const user = users.find((user) => user.username === username && user.password === password);
    
    // Om användaren hittas
    if (user) {
        // Generera en engångskod (OTP)
        const otp = generateOTP();
        
        // Skapa en ny session för användaren
        const newSession = {
            id: sessions.length + 1,
            userId: user.id,
            token: otp,
        };
        
        // Lägg till den nya sessionen i sessions-arrayen
        sessions.push(newSession);

        // Logga data 
        logCurrentData();
        
        // Skicka en HTTP-status 201 (Created) och den nya sessionen som svar
        res.status(201).json({newSession});
    } else {
        // Logga data 
        logCurrentData();
        
        // Skicka en HTTP-status 401 (Unauthorized) och ett felmeddelande som svar
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

// Route för att hämta användarens konton och visa saldo
app.post('/me/account', (req, res) => {

    // Extrahera token från Authorization-headern. Exempel på header: "Bearer 12313"
    const token = req.headers.authorization.split(" ")[1]; 
    console.log("Received token:", token);   

    // Hitta sessionen i sessions-arrayen som matchar token
    const session = sessions.find((session) => session.token === token);
    console.log("Found session:", session);

    // Om sessionen hittas, extrahera userId från sessionen
    if (session) {
            const userId = session.userId;
        
            // Hitta kontot i accounts-arrayen som matchar userId
            const account = accounts.find((acc) => acc.userId === userId);
            if (account) {
                // Om kontot hittas, skicka tillbaka saldo som JSON-svar
                res.json({ balance: account.balance });
            } else {
                // Om kontot inte hittas, skicka tillbaka status 404 och ett felmeddelande
                res.status(404).json({ error: "Account not found" });
            }
      } else {
        // Om sessionen inte hittas, skicka tillbaka status 401 och ett felmeddelande
        res.status(401).json({ error: "Invalid session token" });
      }
})

app.post('/me/account/transaction', (req, res) => {
    
    // Extrahera token från Authorization-headern
    const token = req.headers.authorization.split(" ")[1]; // Extract token from Authorization header
    console.log("Received token:", token);   

    // Hitta sessionen i sessions-arrayen som matchar token
    const session = sessions.find((session) => session.token === token);

    // Om sessionen hittas
    if (session) {
        // Hitta kontot i accounts-arrayen som matchar userId från sessionen
       const account = accounts.find((account) => account.userId === session.userId);
        // Om kontot hittas
        if (account) {
            // Extrahera beloppet från förfrågans body
            const { amount } = req.body;
            
            // Uppdatera kontots saldo med beloppet
            account.balance += amount;
            
            // Skicka tillbaka det uppdaterade kontot som JSON-svar
            res.json(account);
            
            // Skicka tillbaka en 201-status och ett meddelande med det nya saldot
            res.status(201).json({ message: account.balance });
        } else {
            // Om kontot inte hittas, skicka tillbaka en 404-status och ett felmeddelande
            res.status(404).json({ message: 'Account not found' });
        }
    } else {
        // Om sessionen inte hittas, skicka tillbaka en 401-status och ett felmeddelande
        res.status(401).json({ message: 'Invalid Token' });
    }

});

// Startar servern
app.listen(port, () => {
    console.log(`Bankens backend körs på http://localhost:${port}`);
});
