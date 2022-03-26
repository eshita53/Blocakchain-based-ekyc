/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
// 
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { nidApiFetch } = require('./sevices/service.js');
const { existingUserNid, db, getConnection, loginCredentials, existingUserInformation, addingBalance, minusBalance, transactionNotification, deleteLoanRequest } = require('./config/mySQL.js');
const crypto = require('crypto')
const fetch = require('node-fetch');
const key = require('./crypto.js');
const cors = require('cors');
const { request } = require('http');
const { constants } = require('buffer');
const app = express()
const cookieParser = require('cookie-parser');
const { Console } = require('console');
const _ = require('lodash');

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

// db.connect((err) => {
//     if (err) {
//         throw err;
//     }
//     console.log('mysql connected');
// });
// db.getConnection((err)=>{
//     if (err) {
//         throw err;
//     }
//     console.log('mysql connected');
// });

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        /////creating api-call

        app.get('/', async (req, res) => {
            res.send('welcome to ekyc');
        })
        ///creating a new user
        app.post('/createUser', async (req, res) => {
            // console.log('\n\n\nreq paichi\n\n\n');
            if (req.cookies.cookieName == null) {
                ///   console.log('n\n\nno cookie');
                try {
                    const { nid, name, fatherName, motherName, dateOfBirth, gender, passwordHash } = req.body;

                    const userData = [req.body.nid, req.body.name, req.body.motherName, req.body.fatherName, req.body.gender, req.body.dateOfBirth, req.body.passwordHash]
                    // console.log(userData, 'user');
                    const dataString = req.body.nid + req.body.name + req.body.motherName + req.body.fatherName + req.body.gender + req.body.dateOfBirth;
                    // console.log('calling NID api....\n');
                    //console.log(dataString, '\n');
                    ///cookkie
                    // console.log(req.body.dateOfBirth);

                    const data = nidApiFetch(req.body);
                    console.log(data);
                    //  getConnection();
                    const fetch_Nid = await existingUserNid(nid);
                    // console.log(fetch_Nid);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    console.log('\n\nexisting user query global_fetch_Nid --------', fetch_Nid, '\n');
                    if (nid == fetch_Nid) {

                        //   db.end();
                        console.log('when nid present in database');
                        res.status(200).send('Nid used');

                    } else if ((data) && nid !== fetch_Nid) {
                        console.log(nid, 'user input');
                        console.log('fetch', global.fetch_Nid);
                        const query1 = db.query('INSERT IGNORE INTO userRegistration (nid, name, motherName, fatherName, gender, dateOfBirth, passwordHash) VALUES (?, ?, ?, ?,?,?, ?)', userData, (error, result) => {
                            if (error) throw error;
                            //   console.log(result[0].nid);
                            console.log('data has been inserted');
                        });

                        const query2 = db.query('INSERT IGNORE INTO userAccount (nid, name) VALUES (?, ?)', [nid, name], (error, result) => {
                            if (error) throw error;
                            //   console.log(result[0].nid);
                            console.log('Account has been inserted');
                        });
                        // db.end();
                        const ekycHash = crypto.createHash('sha256').update(dataString, 'binary').digest('hex');
                        console.log(ekycHash, '-----------ekyc hash create user\n')
                        console.log(db.status);
                        const publicKey = key.publicKey;
                        const privatecKey = key.privateKey;
                        //    const {publicKey, privatecKey} = key.myFunc();
                        // console.log(privatecKey, publicKey);

                        await contract.submitTransaction('CreateNewUser', nid, ekycHash, publicKey);
                        let result = await contract.evaluateTransaction('QueryUserByParam', nid);
                        //    console.log(result.toString());
                        res.cookie('cookieName', result.toString(), { maxAge: 3600_000, httpOnly: true });
                        var file = privatecKey;

                        res.send(file);

                    } else {
                        res.status(400).send(error.toString()
                        );
                        //   console.log('efgggg');
                    }

                } catch (error) {
                    console.log(error);
                    res.status(400).send(
                        error.toString()
                    );
                    // res.status(404).send(error.toString());
                }
            } else {
                console.log('n\n\ncookie');

                // res.redirect('http://localhost:3000/home');
                res.status(200).send('cookie-found');
            }
        });
        //// login into the system

        app.post('/login', async (req, res) => {
            if (req.cookies.cookieName == null) {
                try {
                    const { nid, passwordHash } = req.body;
                    console.log(nid, passwordHash);
                    // db.getConnection((err)=>{
                    //     if (err) {
                    //         throw err;
                    //     }
                    //     console.log('mysql connected');
                    // });

                    var dataNid, dataPass;
                    console.log('calling chaincode');
                    let result = await contract.evaluateTransaction('QueryUserByParam', nid);
                    console.log(result.toString());
                    res.cookie('cookieName', result.toString(), { maxAge: 3600_000, httpOnly: true });
                    //  const sql = "SELECT * FROM userRegistration where nid=" + mysql.escape(nid);
                    // if (db.status) {
                    //    console.log('mysql is disconnected');
                    //   }
                    console.log('calling database')
                    // getConnection();
                    // console.log('db connection');
                    const userCredentials = await loginCredentials(nid, passwordHash);

                    await new Promise(resolve => setTimeout(resolve, 100));

                    if (userCredentials == 'correct credentials') {
                        console.log('ok status')
                        res.status(200).send('OK');
                    } else if (userCredentials == 'incorrect credentials') {
                        console.log('incorrect status')
                        res.status(404).send('error');
                    }



                    /////////
                    // const userQuery = await db.query(sql, [nid, passwordHash], function (err, result) {
                    //     // await new Promise(resolve => setTimeout(resolve, 500));
                    //     console.log('\n\nprinting query result', result);
                    //     if (err) {
                    //         res.status(404).send(err.toString());
                    //     } else if (result.length != 0) {
                    //         dataNid = result[0].nid;
                    //         dataPass = result[0].passwordHash;
                    //         console.log(dataNid, 'Love  ', dataPass);
                    //         if (dataNid == nid && dataPass == passwordHash) {
                    //             console.log('from logic');

                    // res.status(200).send('OK');
                    // db.end();
                    //             // res.sendStatus(200);
                    //         }
                    //     } else {
                    //         res.status(404).send('error');
                    //     }
                    //     //console.log(result[0].nid);
                    //     //  const dataString = result[0].nid + result[0].name + result[0].motherName + result[0].fatherName + result[0].gender + result[0].dateOfBirth;
                    //     //  console.log(dataString, '-----------data string from log in');
                    //     // ekycHash = crypto.createHash('sha256').update(dataString, 'binary').digest('hex');
                    //     // console.log(ekycHash, '-------------Ekyc hash log in\n')

                    // });
                    // console.log(userQuery)

                    //////


                    //   console.log(dataNid);
                    // ekycHash = crypto.createHash('sha256').update(dataString, 'binary').digest('hex');
                    // console.log('cvbn bcfvndsn')
                    // const returnEkychash = await contract.evaluateTransaction('GetUserEkycHash', nid);
                    // //  console.log(ekycHash)
                    // var hashValue = returnEkychash.toString()
                    // console.log(hashValue, '--------------chaincode hash value\n')
                    // if (ekycHash == hashValue) {
                    //     res.send('you are looged in');
                    // }
                    /// console.log(ans.nid)
                    ///  console.log(dataNid, '  ', dataPass);
                    //
                } catch (error) {
                    res.status(400).json({
                        error: error.toString()
                    });
                    //res.status(404).send(error.toString());

                }
            } else {
                res.send('cookie-found');
                //   res.redirect('http://localhost:3000/home');
            }

        });
        ///logou
        app.get('/logout', async (req, res) => {
            try {
                res.cookie('cookieName', null, { maxAge: -1, httpOnly: true });
                res.json({ status: "You have successfully logged out" });
            } catch (error) {
                res.status(400).json({ error: error.toString() });
            }

        });

        app.post('/moneyTransfer', async function (req, res) {
            //console.log(req.cookies.cookieName)
            try {
                console.log('From Money Transfer\n\n\n\n');
                const { user2AccountNumber, amountToTransfer } = req.body;
                console.log(user2AccountNumber, amountToTransfer);
                let user = JSON.parse(req.cookies.cookieName.toString());

                console.log('cookies', user[0], '\n');
                // console.log(JSON. stringify(user));
                const nid = user[0].Nid;
                console.log('\n\n cookies nid', nid);
                //let result = await contract.evaluateTransaction('QueryUserByParam', nid);
                const userInformation = await existingUserInformation(nid);

                await new Promise(resolve => setTimeout(resolve, 100));

                console.log('\nuser information       ', userInformation);
                console.log('\nuser balance       ', userInformation.balance);
                var eligibleBalance = userInformation.balance - amountToTransfer;
                console.log('\n\n eligibleBalance.....', eligibleBalance);
                if (eligibleBalance >= 500) {
                    const send = await minusBalance(nid, amountToTransfer);
                    //  await new Promise(resolve => setTimeout(resolve, 50));
                    const recieve = await addingBalance(user2AccountNumber, amountToTransfer);
                    await new Promise(resolve => setTimeout(resolve, 50));
                    //console.log(send, 'sender\n', recieve, 'reciever');
                    console.log(send, 'query result', recieve);
                    if (send == 'success' && recieve == 'success') {
                        // console.log('\nuser balance       ', userInformation.accountNumber);
                        // console.log('\nuser account      ', typeof (userInformation.accountNumber));
                        // console.log('\nreciever       ', typeof (Number(user2AccountNumber)));
                        // console.log('\namount       ', typeof (Number(amountToTransfer)));
                        //    console.log('\nuser balance       ', userInformation.accountNumber);
                        //const { sender, reciever, amount } = userInformation.accountNumber, user2AccountNumber
                        const sender = userInformation.accountNumber;
                        const reciever = user2AccountNumber;
                        const amount = amountToTransfer;
                        //const insertIntoUserTransaction 
                        const insertIntoUserTransaction = await db.query('INSERT INTO userTransaction (sender, reciever, amount) VALUES (?, ?, ?)', [sender, reciever, amount], (error, result) => {
                            if (error) throw error;
                            console.log('data has been inserted');
                        });
                        //console.log(insertIntoUserTransaction);
                        const fetch = 'successful';
                        // res.status(200).send('successful');
                        console.log(fetch)
                         res.status(200).send(fetch);
                    }
                } else {
                    res.status(400).send('Unsuccessful');
                }
            } catch (error) {
                res.status(400).send(error);
                    // error: `Error: ${error}`
                // });
            };
        });

        app.post('/loanRequest', async function (req, res) {
            //console.log(req.cookies.cookieName)
            try {
                const amount = req.body.amount;
                const loanTime = req.body.loanTime;
                console.log(amount, loanTime);
                let user = JSON.parse(req.cookies.cookieName.toString());

                console.log('cookies', user[0], '\n');
                // console.log(JSON. stringify(user));
                const nid = user[0].Nid;
                console.log('\n\n cookies nid', nid);
                //let result = await contract.evaluateTransaction('QueryUserByParam', nid);
                const userInformation = await existingUserInformation(nid);
                await new Promise(resolve => setTimeout(resolve, 100));
                const accountNumber = userInformation.accountNumber;
                console.log(typeof (amount));
                console.log(typeof (loanTime));
                console.log(accountNumber);
                //const insertIntoUserTransaction 
                //[accountNumber, amount, loanTime, 1],
                //  db.query ("INSERT INTO loanRequest (accountNumber, amount, loanTime) VALUES ('1234','100', '12')");
                db.query("INSERT INTO loanRequest (accountNumber, amount, loanTime) VALUES (?,?,?)", [accountNumber, amount, loanTime]);
                // await db.query('INSERT INTO loanRequest (accountNumber, amount, loanTime) VALUES (?, ?, ?)', [accountNumber, amount, loanTime], (error, result) => {
                //     if (error) throw error;
                //     console.log('data has been inserted');
                // });
                //console.log(insertIntoUserTransaction);
                const fetch = 'successful';
               // res.status(200).send('successful');
               console.log(fetch)
                res.status(200).send(fetch);
            } catch (error) {
                res.status(400).send(error);
                //     error: `Error: ${error}`
                // });
            };
        });


        app.get('/userNotification', async function (req, res) {

            const notifications = await transactionNotification();
            await new Promise(resolve => setTimeout(resolve, 50));

            res.json(notifications);


        });
        app.get('/loanRequestNotification', async function (req, res) {

            const loanNotifications = await loanRequestNotification();
            await new Promise(resolve => setTimeout(resolve, 50));
            res.json(loanNotifications);
        });

        app.get('/loanRequestAccept', async function (req, res) {

            const accountNumber = req.query.accountNumber;
            const amount = req.query.amount;
            console.log(accountNumber, amount);
            const recieve = await addingBalance(accountNumber, amount);
            await new Promise(resolve => setTimeout(resolve, 50));
            if (recieve == 'success') {
                const result = await deleteLoanRequest(accountNumber);
                res.status(200).send('success');
            } else {
                res.status(400).json({
                    error: `Error: ${error}`
                });
            }
        });


        app.get('/loanRequestDecline', async function (req, res) {

            const accountNumber = req.query.accountNumber;

            const result = await deleteLoanRequest(accountNumber);
            res.status(200).send('success');

        });

        app.get('/profile', async function (req, res) {
            //console.log(req.cookies.cookieName)
            if (req.cookies.cookieName == null) {

                res.json({
                    isLoggedIn: false
                });
                return;
            }
            try {
                let user = JSON.parse(req.cookies.cookieName.toString());
                console.log(user[0], '\n');
                // console.log(JSON. stringify(user));
                const nid = user[0].Nid;
             //   console.log('nid', nid);
                let result = await contract.evaluateTransaction('QueryUserByParam', nid);
                // console.log(result.toString(), '  \nhcgjj');
                user = JSON.parse(result.toString());
                //    console.log(user,'\n');
                user[0].isLoggedIn = true;
              //  console.log(user[0])
              //  console.log('from /profile api', user[0].isLoggedIn);
                res.json(user[0]);
            } catch (error) {
                res.status(400).json({
                    error: `Error: ${error}`,
                    isLoggedIn: false,
                });
            }
        })
        app.get('/userAccountDetails', async function(req, res){
            const {nid }= req.query;
            console.log('from nodejs swr   ', nid);
            const userInformation = await existingUserInformation(nid);
            await new Promise(resolve => setTimeout(resolve, 100));
            console.log('from userAccountDetails---------',userInformation);
            res.json(userInformation);

        })
        app.get('/home', async (req, res) => {
            try {
                if (req.cookies.cookiename != null) {
                    res.send('welcome to home page');
                }
                else {
                    res.send('you have to log in to view this page!!');
                }
            } catch (error) {
                res.status(400).json({
                    error: error.toString()
                });

            }

        });


        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        // const result = await contract.evaluateTransaction('queryAllCars');
        // console.log(`Transaction has been evaluated, result is: ${result.toString()}`);






        // const result = await contract.submitTransaction('CreateNewUser', '123478', 'dbba23', '1nxczvdsbs');
        // console.log(`Transaction has been evaluated, result is: ${result.toString()}`); 
        // const result1 = await contract.evaluateTransaction('QueryUserByParam', '01234567');
        // console.log(`Transaction has been evaluated, result1 is: ${result1.toString()}`);
        // const result2 = await contract.evaluateTransaction('ReturnEkycHash', '1234');
        // console.log(`Transaction has been evaluated, result2 is: ${result2.toString()}`);
        // Disconnect from the gateway.
        //   gateway.disconnect();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}
app.listen(8080)
console.log('app is listening on port 8080!!!!!')

main();
