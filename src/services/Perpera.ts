export default class PerperaService {
  private perpera: any;
  private network: string;

  constructor(network?: string) {
    this.perpera = window['perpera'];
    this.network = network || window['perpera'].networks['peercoin'];
  }

  public getDocument(hash: string) {
    return new this.perpera.Document(hash, this.network);
  }

  public async setDocument(hash: string, hashAlgo: string, wif: string) {
    const doc = new this.perpera.Document(hash, this.network);
    const spender = this.perpera.Spender.fromWIF(wif.trim(), this.network);
    await spender.sync();
    return await doc.updateContent({hashAlgo: hash}, spender);
  }

  public async updateDocument(originalHash: string, hash: string, hashAlgo: string, wif: string) {
    const doc = new this.perpera.Document(hash, this.network);
    const spender = this.perpera.Spender.fromWIF(wif.trim(), this.network);
    await spender.sync();
    return await doc.updateContent({hashAlgo: hash}, spender);
  }

  public async getFee(hash: string, hashAlgo: string, wif: string) {
    const doc = new this.perpera.Document(hash, this.network);
    const spender = this.perpera.Spender.fromWIF(wif.trim(), this.network);
    await spender.sync();
    const update = await doc.considerUpdatingContent({hashAlgo: hash}, spender);
    return {
      fee: (update.getFee() / 10**6),
      reference: update
    }
  }

  public async getRawTransaction(hash: string, hashAlgo: string, wif: string) {
    const doc = new this.perpera.Document(hash, this.network);
    const spender = this.perpera.Spender.fromWIF(wif.trim(), this.network);
    await spender.sync();
    return await doc.getRawTransaction({hashAlgo: hash}, spender);
  }
}
