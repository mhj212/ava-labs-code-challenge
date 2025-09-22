import { simulateApiRequest } from './utils'

interface VaultData {
    account: string;
    vault: string;
    avax: string;
    price: string;
}

const vaultData = [
    {
        account: 'Account 0',
        vault: "Aki's Test Vault",
        avax: '37.974062606 AVAX',
        price: '$973.28'
    },
    {
        account: 'Account 0',
        vault: "Krishna's Test Vault",
        avax: '21.10 AVAX',
        price: '$540.79'
    },
    {
        account: 'Account 0',
        vault: "Mike's BIP44 Vault",
        avax: '1.60 AVAX',
        price: '$41.01'
    },
    {
        account: 'Account 0',
        vault: "Mobile Signer's Test Vault",
        avax: '3.999958927 AVAX',
        price: '$102.52'
    },
];

export const fetchVaultsUpdated = async () => simulateApiRequest(vaultData)
