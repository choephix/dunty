export function makeURLsFromIPFSHash(ipfsHash: string) {
  return [
    `https://ipfs.trains.cards/ipfs/${ipfsHash}`,
    `https://train-of-the-century.mypinata.cloud/ipfs/${ipfsHash}`,
    // `https://ipfs.atomichub.io/ipfs/${ipfsHash}`,
    `https://ipfs.io/ipfs/${ipfsHash}`,
    `https://ipfs.infura.io/ipfs/${ipfsHash}`,
    `https://gateway.pinata.cloud/${ipfsHash}`,
  ];
}
