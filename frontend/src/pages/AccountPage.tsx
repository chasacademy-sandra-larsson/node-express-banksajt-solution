import { useEffect, useState } from 'react';


function AccountPage() {

    const [balance, setBalance] = useState(0);
    const [depositAmount, setDepositAmount] = useState(0);

    useEffect(() => {
        fetchAccountBalance();
    }, []);

    const fetchAccountBalance = async () => {

        try {
            const sessionToken = localStorage.getItem('token');
            if(!sessionToken) {
                throw new Error('No session token');
                return;
            }
            
            const response = await fetch('http://localhost:3000/me/account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionToken}`,
                }
            });
            if(response.ok) {
                const data = await response.json();
                setBalance(data.balance);
            } else {
                console.error('Error:', response);
            }
        } catch (error) {
            console.error('Error:', error);
        }

    };

    const depositMoney = async () => {
        try {
            const sessionToken = localStorage.getItem('token');
            if(!sessionToken) {
                throw new Error('No session token');
                return;
            }
            const response = await fetch('http://localhost:3000/me/account/transaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionToken}`,
                },
                body: JSON.stringify({
                    amount: depositAmount,
                }),
            });
            if(response.ok) {
               
                fetchAccountBalance();
            } else {
                console.error('Error:', response);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }


  return (
    <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
       <h1 className='mb-10 text-3xl'>Ditt konto</h1>
      <div className='flex flex-col gap-5 text-lg'>
        <p>
          <span>Saldo:</span> {balance} kronor
        </p>
        <div >
          <p>Insättning</p>
        </div>
        <div>
          <label htmlFor="depositAmount">
            Belopp (SEK):
          </label>
          <input
            type="number"
            id="depositAmount"
            value={depositAmount}
            onChange={(e) => {
                const value = parseFloat(e.target.value);
                setDepositAmount(isNaN(value) ? 0 : value);
              }}
              className='block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          />
        </div>
        <div>
          <button onClick={depositMoney} className="bg-slate-400 text-white rounded-lg font-semibold leading-tight px-5 py-2  ">Sätt in</button>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;