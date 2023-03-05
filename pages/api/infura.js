import axios from "axios";

export async function getBalance(address, param) {
    let balanceString = ""
    const response = await axios.post(
        'https://mainnet.infura.io/v3/e16d6a5698dd4484b6f16a02b9e963ac',
        {
            'jsonrpc': '2.0',
            'method': 'eth_getBalance',
            'params': [
                address,
                param // latest, pending, earliest
            ],
            'id': 1
        },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    ).then(
        async (response) => {
            console.log("getBalance response: " + response.data.result);
            balanceString = response.data.result + ""
        }
    )
    return balanceString
}