import Web3 from 'web3';

const getWeb3 = () => {
    return new Web3(Web3.givenProvider)
}


export const web3 = getWeb3()

const fromAddress = '';
const expiry = Date.now() + 120
const nonce = 1;
const spender = '';

const createPermitMessageData = function () {

    const message = {
        holder: fromAddress,
        spender: spender,
        nonce: nonce,
        expiry: expiry,
        allowed: true
    }

    const typedData = JSON.stringify({
        types: {
            EIP712Domain: [{
                name: 'name',
                type: 'string'
            },
            {
                name: 'version',
                type: 'string'
            },
            {
                name: 'chainId',
                type: 'uint256'
            },
            {
                name: 'verifyingContract',
                type: 'address'
            },
            ],
            Permit: [{
                name: 'holder',
                type: 'address'
            },
            {
                name: 'spender',
                type: 'address'
            },
            {
                name: 'nonce',
                type: 'uint256'
            },
            {
                name: 'expiry',
                type: 'uint256'
            },
            {
                name: 'allowed',
                type: 'bool'
            },
            ],
        },
        primaryType: 'Permit',
        domain: {
            name: 'Dai Stablecoin',
            version: '1',
            chainId: 42,
            verifyingContract: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
        },
        message: message
    });

    return {
        typedData,
        message
    }
}


const signData = async function (web3, fromAddress, typeData) {
    return new Promise(function (resolve, reject) {
        web3.currentProvider.sendAsync({
            id: 1,
            method: "eth_signTypedData_v3",
            params: [fromAddress, typeData],
            from: fromAddress
        },
            function (err, result) {
                if (err) {
                    reject(err) //TODO
                } else {
                    const r = result.result.slice(0, 66)
                    const s = '0x' + result.result.slice(66, 130)
                    const v = Number('0x' + result.result.slice(130, 132))
                    resolve({
                        v,
                        r,
                        s
                    })
                }
            }
        );
    });
}

export const signTransferPermit = async function () {
    const messageData = createPermitMessageData()
    const sig = await signData(web3, fromAddress, messageData.typedData);
    return Object.assign({}, sig, messageData.message)
}