const contractAddress = '0x6414669Eb0a198724C5E6E10dA8D6e171021cdB3';
const contractAbi = [{
    "constant": false,
    "inputs": [],
    "name": "enter",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "selectWinner",
    "outputs": [{
      "name": "",
      "type": "address"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getPlayers",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [{
      "name": "",
      "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{
      "name": "",
      "type": "uint256"
    }],
    "name": "players",
    "outputs": [{
      "name": "",
      "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "result",
    "outputs": [{
      "name": "",
      "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

// MetaMask and web3.js checker
window.addEventListener('load', async () => {
  console.log('load', Web3.version);
  // Modern dapp browsers...
  if (window.ethereum) {
      console.log('load: ethereum');
    // var web3 = new Web3(ethereum);
    // window.web3 = new Web3(ethereum);
    try {
      // Request account access if needed
      await ethereum.enable();
      setStatus('MetaMask Detected!');
      window.web3 = new Web3(ethereum);
      afterLoad();
      // Acccounts now exposed
      //web3.eth.sendTransaction({/* ... */});
    } catch (error) {
      // User denied account access...
    }
  }
  // Legacy dapp browsers...
  else if (window.currentProvider) {
    console.log('load: currentProvider');
    window.web3 = new Web3(currentProvider);
    setStatus('Web3 Detected! and connected with Legacy dapp browser');
    afterLoad();
    // Acccounts always exposed
    //web3.eth.sendTransaction({/* ... */});
  }
  // Non-dapp browsers...
  else {
    setStatus("Non-Ethereum browser detected. You should consider trying MetaMask!");
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }
});

// Set status of MetaMask
function setStatus(message) {
  // document.getElementById("status").innerHTML = message;
  $('#status').html(message);
}

// runs after load event, and instance creation
function afterLoad() {
  console.log('afterLoad');
  // Create instance of solidity contract
  var contractLottery = new web3.eth.Contract(contractAbi, contractAddress);
  // console.log(contractLottery);


  (async function() {


    // Owner of the contract
    var ownerAddress = '';
    var owner = await contractLottery.methods.owner().call().then(async function(result) {
      console.log(result);
      ownerAddress = await result;
      $('#contractOwner').html('This contract is managed by ' + result);
    });


    // total players in Lottery
    var playersCount = contractLottery.methods.getPlayers().call().then(function(index) {
      console.log(index);
      $('#playersDetails').html('There are currently ' + index + ' players trying there  luck for winning')
    });


    // userAccount as msg.sender
    var userAccount = '';
    var accounts = await web3.eth.getAccounts().then(async (account) => {
      console.log(account[0]);
      userAccount = await account[0];
    }).catch((e) => {
      console.log(e);
    });
    console.log(userAccount);

    // Get Contract address
    var cAddress = await contractLottery.options.address;
    console.log(cAddress);

    //Get contract balance
    var getContractBalance = await web3.eth.getBalance(cAddress).then(function(result) {
      console.log(result);
      var conversion = web3.utils.fromWei(result, 'ether');
      console.log((conversion));
      $('#totalPrize').html('Total pool of lottery is ' + conversion + ' Ether!')
    });


    // Submit form
    $('#button').click(function() {

      // Get user input
      var value = $('#amount').val();
      console.log(value);

      // Check input validation
      if (value == 1) {

        // Convert Ether to Wei
        var toWeiConvert = web3.utils.toWei(value, 'ether');
        console.log(toWeiConvert);
        $('#txStatus').html('Please approve your transctions and wait for few seconds...');

        // Enter player into lottery
        var enterPlayer = contractLottery.methods.enter().send({
          from: userAccount,
          value: toWeiConvert
        }).then(async function(result) {
          $('#txStatus').html('Your transaction is successfully completed.' + '<br>' + "Your transactions hash is " + result.transactionHash);
          await console.log(result);
          await console.log(result.blockHash);
          await console.log(result.blockNumber);
          await console.log(result.transactionHash);
        }).catch((e) => {
          console.log(e);
        });
      } else {
        $('#txStatus').html('1 Ether is required for lottery submission.')
      };
    });

    // Pick a Winner

    selectWinner = async function() {
      if (userAccount === ownerAddress) {
        var lotteryWinner = await contractLottery.methods.selectWinner().send({
          'from': userAccount
        }).then(async function() {

          contractLottery.methods.owner().call().then(async function(result) {
            console.log(result);
            $('#txStatus').html('The winner of this lottery ' + result);
          })

        });
      } else {
        $('#txStatus').html('Only owner of the contract can pick a winner!')
      }
      console.log(userAccount);
      console.log(ownerAddress);
    }

  })();
}


// var userAccount = '';
// var accounts = web3.eth.getAccounts().then( async (account) => {
//   console.log(account[0]);
//   userAccount = await account[0];
//   console.log(userAccount);
// }).catch((e) => { console.log(e); });
// console.log(userAccount);
