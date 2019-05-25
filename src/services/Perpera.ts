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

  public async setDocument(hash: string, wif: string) {
    const doc = new this.perpera.Document(hash, this.network);
    const spender = this.perpera.Spender.fromWIF(wif, this.network);
    await spender.sync();
    return await doc.updateContent({'sha2-256': hash}, spender);
  }

  public async updateDocument(originalHash: string, hash: string, wif: string) {
    const doc = new this.perpera.Document(hash, this.network);
    const spender = this.perpera.Spender.fromWIF(wif, this.network);
    await spender.sync();
    return await doc.updateContent({'sha2-256': hash}, spender);
  }

  public async getFee(hash: string, wif: string) {
    const doc = new this.perpera.Document(hash, this.network);
    const spender = this.perpera.Spender.fromWIF(wif, this.network);
    await spender.sync();
    const update = await doc.considerUpdatingContent({'sha2-256': hash}, spender);
    return {
      fee: (update.getFee() / 10**6),
      reference: update
    }
  }
}
