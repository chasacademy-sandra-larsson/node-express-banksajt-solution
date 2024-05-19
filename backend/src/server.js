import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';


const app = express();
const port = 3000;

// Middleware
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




// Middleware to log users, accounts, and sessions
function logCurrentData() {
    console.log('Users:', users);
    console.log('Accounts:', accounts);
    console.log('Sessions:', sessions);
   
}

// Din kod här. Skriv dina routes:

// Route för att skapa en användare
app.post('/users', (req, res) => {

    const { username, password } = req.body;
   
    const newUser = {
        id: users.length + 1,
        username,
        password,
    };

    users.push(newUser);
    
    const newAccount = {
        id: accounts.length + 1,
        userId: newUser.id,
        balance: 0,
    };
    accounts.push(newAccount);

    logCurrentData();

  return res.status(201).json({user: newUser, account: newAccount});

});

// Route för att logga in
app.post('/sessions', (req, res) => {

    const { username, password } = req.body;

    const user = users.find((user) => user.username === username && user.password === password);
    if (user) {
        const otp = generateOTP();
        const newSession = {
            id: sessions.length + 1,
            userId: user.id,
            token: otp,
        };
        sessions.push(newSession);
        console.log("New session:", newSession)
        logCurrentData();
        res.status(201).json({newSession});
    } else {
        logCurrentData();
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

// Route för att hämta användarens konton och visa saldo
app.post('/me/account', (req, res) => {

    const token = req.headers.authorization.split(" ")[1]; // Extract token from Authorization header. "Bearer 12313"
    console.log("Received token:", token);   

    const session = sessions.find((session) => session.token === token);
    console.log("Found session:", session);
    if (session) {
            const userId = session.userId;
            const account = accounts.find((acc) => acc.userId === userId);
            console.log("Found account:", account);
            if (account) {
                 res.json({ balance: account.balance });
            } else {
                res.status(404).json({ error: "Account not found" });
            }
      } else {
        res.status(401).json({ error: "Invalid session token" });
      }
})

app.post('/me/account/transaction', (req, res) => {

    const token = req.headers.authorization.split(" ")[1]; // Extract token from Authorization header
    console.log("Received token:", token);   
    const session = sessions.find((session) => session.token === token);
    if (session) {
       const account = accounts.find((account) => account.userId === session.userId);
        if (account) {
            const { amount } = req.body;
            account.balance += amount;
            res.json(account);
            res.status(201).json({ message: account.balance });
        } else {
            res.status(404).json({ message: 'Account not found' });
        }
    } else {
        res.status(401).json({ message: 'Invalid Token' });
    }

});

// Starta servern
app.listen(port, () => {
    console.log(`Bankens backend körs på http://localhost:${port}`);
});
