const mysql = require("mysql2/promise");

//const mysql =require("mysql2");
const dotenv = require('dotenv');
const _ = require('lodash');
var util = require('util');
const { mainModule } = require('process');
dotenv.config();

const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_DATABASE = process.env.DB_DATABASE
const DB_PORT = process.env.DB_PORT

const db = mysql.createPool({
    connectionLimit: 100,
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: DB_PORT,
    // queueLimit: 0
})


// db.connect((err) => {
// if (err) {
//     throw err;
// }
// console.log('mysql connected');
// });
// db.getConnection((err)=>{
//     if (err) {
//         throw err;
//     }
//     console.log('mysql connected');
// });
var getConnection = function (callback) {
    db.getConnection(function (err, connection) {
        callback(err, connection);
    });
};

const transactionNotification = async () => {
    try {

        const notification = await db.query('SELECT * FROM userTransaction');
        //await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(notification[0]);
        return notification[0];
    } finally {
        //  db.end();
    }
};
const loanRequestNotification = async () => {
    try {

        const loanNotification = await db.query('SELECT * FROM loanRequest');
        //await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(loanNotification[0]);
        return loanNotification[0];
    } finally {
        //  db.end();
    }
};



const existingUserNid = async (nid) => {
    try {
        console.log(nid);
        const fetch_Nid = await db.query('SELECT nid FROM userRegistration WHERE nid = ?', nid);
        //await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(typeof (fetch_Nid));
        //  console.log(fetch_Nid.values);
        console.log('\nfetch_Nid[0]', fetch_Nid[0]);
        console.log(fetch_Nid[0].length);
        console.log('\nfetch_Nid[0][0]', fetch_Nid[0][0]);
        // console.log(fetch_Nid[0][0].length);
        // const isEmpty = Object.keys(fetch_Nid).length === 0;
        // console.log(isEmpty);
        if (fetch_Nid[0].length > 0) {
            console.log('fetching nid from db', fetch_Nid, '\n\n Fetching existing user NID from DB', fetch_Nid[0][0]);
            return fetch_Nid[0][0].nid;
        } else {
            // console.log('fetching nid from db', fetch_Nid, '\n\n Fetching existing user NID from DB', fetch_Nid[0][0]);
            // return fetch_Nid[0][0].nid;
            return 'fetch_Nid';
        }

    } finally {
        //  db.end();
    }
};

const loginCredentials = async (nid, passwordHash) => {
    try {
        console.log(nid, passwordHash);
        const fetch_Nid = await db.query('SELECT nid, passwordHash FROM userRegistration WHERE nid = ? && passwordHash = ?', [nid, passwordHash]);
        // function (err, result) {});
        console.log('\nfetch_Nid[0]', fetch_Nid[0]);
        console.log(fetch_Nid[0].length);
        console.log('\nfetch_Nid[0][0]', fetch_Nid[0][0]);
        // console.log(fetch_Nid[0][0].length);
        // const isEmpty = Object.keys(fetch_Nid).length === 0;
        // console.log(isEmpty);
        if (fetch_Nid[0].length > 0) {
            console.log('fetching nid from db', fetch_Nid, '\n\n Fetching existing user nid na dpassword  from DB', fetch_Nid[0][0]);
            if (fetch_Nid[0][0].nid == nid && fetch_Nid[0][0].passwordHash == passwordHash) {
                return 'correct credentials'
                // res.sendStatus(200);
            }

            //  return fetch_Nid[0][0].nid;

        } else {
            // console.log('fetching nid from db', fetch_Nid, '\n\n Fetching existing user NID from DB', fetch_Nid[0][0]);
            // return fetch_Nid[0][0].nid;
            return 'incorrect credentials'

        }

    } finally {
        //  db.end();
    }
};

const addingBalance = async (accountNumber, amount) => {
    try {
        console.log('\n accountNumber, amount ', accountNumber, amount);
        const sql = 'update userAccount set balance = balance + ? where accountNumber = ?';
        const result = await db.query(sql, [amount, accountNumber]);

        console.log('amount has been added to the account');

        return 'success';

    } finally {
        //  db.end();
    }
};
const minusBalance = async (nid, amount) => {
    try {
        console.log('\n accountNumber, amount ', nid, amount);
        const sql = 'update userAccount set balance = balance - ? where nid = ?';
        const result = await db.query(sql, [amount, nid]);

        console.log('amount has been reduced from account');

        return 'success';

    } finally {
        //  db.end();
    }
};
const deleteLoanRequest = async (accountNumber) => {
    try {
        const sql = 'DELETE FROM loanRequest WHERE accountNumber = ?'
        const deleteRequest = await db.query(sql, accountNumber);
        console.log('Request has been deleted from loan request que');
        return 'success';

    } finally {

    }

};


const existingUserInformation = async (nid) => {
    try {
        console.log(nid);
        const fetch_Nid = await db.query('SELECT * FROM userAccount WHERE nid = ?', nid);
        //await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(typeof (fetch_Nid));
        //  console.log(fetch_Nid.values);
        // console.log('\nfetch_Nid[0]', fetch_Nid[0]);
        // console.log(fetch_Nid[0].length);
        // console.log('\nfetch_Nid[0][0]', fetch_Nid[0][0]);
        // console.log(fetch_Nid[0][0].length);
        // const isEmpty = Object.keys(fetch_Nid).length === 0;
        // console.log(isEmpty);
        if (fetch_Nid[0].length > 0) {
            console.log('fetching nid from db', fetch_Nid, '\n\n Fetching existing user NID from DB', fetch_Nid[0][0]);
            return fetch_Nid[0][0];
        } else {
            // console.log('fetching nid from db', fetch_Nid, '\n\n Fetching existing user NID from DB', fetch_Nid[0][0]);
            // return fetch_Nid[0][0].nid;
            return 'empty';
        }

    } finally {
        //  db.end();
    }
};

module.exports = { existingUserNid, db, getConnection, loginCredentials, existingUserInformation, addingBalance, minusBalance, transactionNotification, loanRequestNotification, deleteLoanRequest };