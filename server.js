const express = require("express");
const app = express();
const port = 3000 || process.env.PORT;
const Web3 = require("web3");
const truffle_connect = require("./connection/app.js");
const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/", express.static("public_static"));

app.get("/getAccounts", (req, res) => {
  console.log("**** GET /getAccounts ****");
  truffle_connect.start(function (answer) {
    res.send(answer);
  });
});
app.get("/api/getAccounts", (req, res) => {
  console.log("**** GET /getAccounts ****");
  truffle_connect.start(function (answer) {
    console.log(answer);
    res.status(200).send({
      success: "true",
      accounts: answer,
    });
  });
});
//********get accounts********
app.get("/api/getAccounts/:id", (req, res) => {
  console.log("**** GET /getAccount ****");
  truffle_connect.start(function (answer) {
    console.log(answer[req.params.id - 1]);
    res.status(200).send({
      success: "true",
      accounts: answer[req.params.id - 1],
    });
  });
});
//********get balance********
app.get("/api/getBalance/:id", (req, res) => {
  console.log("**** GET /getAccountBalance ****");
  var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
  truffle_connect.start(function (answer) {
    console.log(answer[req.params.id - 1]);
    var balance = web3.eth.getBalance(answer[req.params.id - 1]);
    var balanceEther = web3.fromWei(balance, "ether");
    console.log(balance);
    res.status(200).send({
      success: "true",
      accounts: answer[req.params.id - 1],
      balance: balance,
      balanceInEther: balanceEther,
    });
  });
});
//********get transaction number********
app.get("/api/getTrans/:id", (req, res) => {
  console.log("GET Transactions");

  truffle_connect.start(function (answer) {
    console.log(answer[req.params.id - 1]);
    var transactions = web3.eth.getTransactionCount(answer[req.params.id - 1]);
    res.status(200).send({
      success: "true",
      transactionNum: transactions,
    });
  });
});

//book store functionality
pp.post("/api/sellBook/:id", (req, res) => {
  // var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
  console.log("**** GET /sellBook ****");
  console.log(req.body);
  const { fullname, discription, price } = req.body;
  truffle_connect.start(function (answer) {
    console.log(answer[req.params.id - 1]);
    truffle_connect.sellBook(
      answer[req.params.id - 1],
      fullname,
      discription,
      price,
      (answer) => {
        res.send(answer);
      }
    );
  });
});

app.get("/api/getBook", (req, res) => {
  console.log("**** GET /getBooks ****");
  var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
  truffle_connect.getBook((answer) => {
    res.send(answer);
  });
});
//---------------------------------------------
app.post("/getBalance", (req, res) => {
  console.log("**** GET /getBalance ****");
  console.log(req.body);
  let currentAcount = req.body.account;

  truffle_connect.refreshBalance(currentAcount, (answer) => {
    let account_balance = answer;
    truffle_connect.start(function (answer) {
      // get list of all accounts and send it along with the response
      let all_accounts = answer;
      response = [account_balance, all_accounts];
      res.send(response);
    });
  });
});

// app.post("/sendCoin", (req, res) => {
//   console.log("**** GET /sendCoin ****");
//   console.log(req.body);

//   let amount = req.body.amount;
//   let sender = req.body.sender;
//   let receiver = req.body.receiver;

//   truffle_connect.sendCoin(amount, sender, receiver, (balance) => {
//     res.send(balance);
//   });
// });

app.listen(port, () => {
  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  truffle_connect.web3 = new Web3(
    new Web3.providers.HttpProvider("http://127.0.0.1:7545")
  );

  console.log("Express Listening at http://localhost:" + port);
});
