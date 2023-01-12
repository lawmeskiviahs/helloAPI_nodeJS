import Web3Service from './web3.service';
import CONFIG from '../config';
import l from '../../common/logger';

// import * as CryptoJS from 'crypto-js';

class CardsService {
  private contract = Web3Service.contract;

  /**
   * @function bundleMint
   * @description Mint new cards on blockchain - Only owner
   */
  public async bundleMint(_tokenId: number, tokenURIs: string): Promise<any> {
    try {
      /** Using admin address and private key as wallet */
      const address = CONFIG.ADMIN.WALLET_ADDRESS;
      const privateKey = CONFIG.ADMIN.PRIVATE_KEY;
      console.log(_tokenId, 'tokenId Listed');
      console.log(tokenURIs, ' <<<< URI');
      /** get mint info and modify according to smart contract function */

      //   let tokenId: any[] = [], tokenUri: any[] = [];

      //   tokenId.push(Number(_tokenId))
      //   tokenUri.push(tokenURIs);

      //   console.log(tokenId, 'tokenId Listed');
      //   console.log(tokenUri)

      /** only do transaction if _addresses array length is greater than zero */
      if (_tokenId) {
        const card = { _tokenId, tokenURIs, wallet: { address, privateKey } };
        /** Contract signature on function */
        const estimatedGas = await this.contract.methods
          .mintToken(_tokenId, tokenURIs)
          .estimateGas({ from: address, value: 0 });
        if (!estimatedGas) {
          return {
            error: false,
            message: 'Something went Wrong in estimatedGas',
          };
        }
        console.log('\n', estimatedGas, 'estimatedGas Listed \n');
        const fnSignature = await this.contract.methods
          .mintToken(_tokenId, tokenURIs)
          .encodeABI();
        if (!fnSignature) {
          return {
            error: false,
            message: 'Something went Wrong in fnSignature',
          };
        }
        let resposneHash: any = await Web3Service.signTransaction(
          card,
          fnSignature,
          estimatedGas
        );
        if (resposneHash.error) throw resposneHash;

        if (resposneHash.transactionHash) {
          return resposneHash.transactionHash;
        }
        return false;
      }
    } catch (error: any) {
      l.error(error, ' Bundle mint => error');
      console.log('\n Bundle mint => error', error, '\n');
      return {
        error: false,
        message: 'Something went Wrong in bundleTransfer',
      };
    }
  }

  /**
   * @function bundleTransfer
   * @description Transfer card from peer to peer in bundles
   */
  //   public async bundleTransfer(): Promise<any> {
  //     try {
  //       /** Using admin address and private key as wallet */
  //       const address = CONFIG.ADMIN.WALLET_ADDRESS;
  //       const privateKey = CONFIG.ADMIN.PRIVATE_KEY;

  //       /** get mint info and modify according to smart contract function */
  //       const { error, data } = await CardModel.getUnlistedBundleMints(CONFIG.DB_NFT.LIMIT, { blockChainHash: null, context: CONFIG.CONTEXT_TYPE.PRIMARY });
  //       if (error) throw error
  //       let _cardIds: any[] = [], to: any[] = [], _originalCard: any[] = [];

  //       for (const card of data) {
  //         const { customCardId, nftMintId, toAddress } = card;
  //         if (toAddress && customCardId) {
  //           _cardIds.push(parseInt(customCardId));
  //           _originalCard.push(nftMintId)
  //           to.push(toAddress);
  //         }
  //       }
  //       console.log(_cardIds, 'card Listed')
  //       console.log(to, 'to_address Listed')
  //       /** only do transaction if _addresses array length is greater than zero */
  //       if (_cardIds.length > 0) {
  //         const card = { _cardIds, to, wallet: { address, privateKey } };
  //         /** Contract signature on function */
  //         const estimatedGas = await this.contract.methods.bundleTransfer(to, _cardIds).estimateGas({ from: address, value: 0 });
  //         if (!estimatedGas) {
  //           return {
  //             error: false,
  //             message: 'Something went Wrong in estimatedGas'
  //           }
  //         }
  //         const fnSignature = await this.contract.methods.bundleTransfer(to, _cardIds).encodeABI();
  //         if (!fnSignature) {
  //           return {
  //             error: false,
  //             message: 'Something went Wrong in fnSignature'
  //           }
  //         }
  //         console.log(estimatedGas, "bundleTransfer >>>>> ");
  //         let resposneHash = await Web3Service.signTransaction(card, fnSignature, "BUNDLE_TRANSFER", estimatedGas);
  //         // console.log("resposneHash", resposneHash)
  //         if (resposneHash.error) throw resposneHash;
  //         if (resposneHash.status) {
  //           CardModel.updateMint(_originalCard, resposneHash.transactionHash, CONFIG.CONTEXT_TYPE.PRIMARY as string, 'cardId');
  //         }
  //       }
  //     } catch (error) {
  //       console.log("\n Bundle bundleTransfer => error", error, "\n");
  //       return {
  //         error: false,
  //         message: 'Something went Wrong in bundleTransfer'
  //       }
  //     }
  //   }

  /**
    * @function bundleBurn
    * @description Transfer card from peer to peer in bundles
//     */
  //   public async bundleBurn(): Promise<any> {
  //     try {
  //       /** Using admin address and private key as wallet */
  //       const address = CONFIG.ADMIN.WALLET_ADDRESS;
  //       const privateKey = CONFIG.ADMIN.PRIVATE_KEY;

  //       /** get mint info and modify according to smart contract function */
  //       const { error, data } = await CardModel.getUnlistedBundleMints(CONFIG.DB_NFT.LIMIT, { blockChainHash: null, context: CONFIG.CONTEXT_TYPE.BURNED });
  //       if (error) throw error
  //       let _cardIds: any[] = [], _originalCard: any[] = [];;

  //       for (const card of data) {
  //         const { customCardId, nftMintId } = card;
  //         if (customCardId) {
  //           _cardIds.push(parseInt(customCardId));
  //           _originalCard.push(nftMintId)
  //         }
  //       }
  //       console.log(_cardIds, 'card bundleBurn Listed')
  //       /** only do transaction if _addresses array length is greater than zero */
  //       if (_cardIds.length > 0) {
  //         const card = { _cardIds, wallet: { address, privateKey } };
  //         /** Contract signature on function */
  //         const estimatedGas = await this.contract.methods.bundleBurn(_cardIds).estimateGas({ from: address, value: 0 });
  //         if (!estimatedGas) {
  //           return {
  //             error: false,
  //             message: 'Something went Wrong in estimatedGas'
  //           }
  //         }
  //         console.log(estimatedGas, ' Burn estimategas')
  //         const fnSignature = await this.contract.methods.bundleBurn(_cardIds).encodeABI();
  //         if (!fnSignature) {
  //           return {
  //             error: false,
  //             message: 'Something went Wrong in fnSignature'
  //           }
  //         }
  //         let resposneHash = await Web3Service.signTransaction(card, fnSignature, "BUNDLE_TRANSFER", estimatedGas);
  //         if (resposneHash.error) throw resposneHash;
  //         if (resposneHash.status) {
  //           CardModel.updateMint(_originalCard, resposneHash.transactionHash, CONFIG.CONTEXT_TYPE.BURNED as string, 'cardId');
  //         }
  //       }
  //     } catch (error) {

  //       console.log("\n Bundle bundleBurn => error", error, "\n");
  //       return {
  //         error: false,
  //         message: 'Something went Wrong in bundleBurn'
  //       }
  //     }
  //   }

  /**
   * @function cardDrops
   * @description make transaction on blockchain - Transfer cardids using batch trransfers
   */
  //   public async batchTransferFrom(): Promise<any> {
  //     try {
  //       const { error, data } = await CardModel.getUnlistedSecondary(CONFIG.DB_NFT.LIMIT, { blockChainHash: null, context: CONFIG.CONTEXT_TYPE.SECONDARY });
  //       if (error) throw error;
  //       for (const cardVal of data) {
  //         let cards: any;
  //         const { customCardId, fromAddress, toAddress } = cardVal;
  //         const responseWallet: any = await WalletModel.getWalletInfoByCardid(fromAddress);
  //         if (responseWallet.data.privateKey) {
  //           cards = {
  //             wallet: { "privateKey": responseWallet.data.privateKey, "address": fromAddress }
  //           };
  //         }
  //         console.log(customCardId, 'card Secondary Listed')
  //         console.log(fromAddress, 'fromAddress Secondary Listed')

  //         const fnSignature = await this.contractBiconomy.methods.batchTransferFrom(fromAddress, toAddress, [Number(customCardId)]).encodeABI();
  //         if (!fnSignature) {
  //           return {
  //             error: false,
  //             message: 'Something went Wrong in fnSignature'
  //           }
  //         }
  //         let resposneHash = await Web3Service.signTransactionBiconomy(cards, fnSignature);

  //         if (resposneHash.error) throw resposneHash;
  //         if (resposneHash.status) {
  //           CardModel.updatebyMintId(cardVal.nftMintId, resposneHash.transactionHash, CONFIG.CONTEXT_TYPE.SECONDARY as string);
  //         }
  //       }
  //     } catch (error: any) {
  //       console.log("\n Batch Transfers => error", error, "\n");
  //       return {
  //         error: false,
  //         message: 'Something went Wrong in batchTransferFrom'
  //       }
  //     }
  //   }
}

export default new CardsService();
