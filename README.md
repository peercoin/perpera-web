# Perpera Project

A Data Audit Protocol.

The primary purpose of this protocol is to record cryptographic hashes of successive revisions of single-file documents in a public blockchain, in a manner which enables thin clients to easily query and verify document histories. Such histories inherit useful properties from the underlying blockchain, namely immutability and massive replication, and can therefore serve as proofs of existence.

The goal is to impose minimal requirements on the blockchain, in terms of both features and storage space.

This web app is based on [perpera](https://github.com/peercoin/perpera) library.

## Run locally:

```
npm install
npm start
```

Then open http://localhost:3000/

## Deploy:

`npm run deploy`
