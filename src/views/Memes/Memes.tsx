import React, { useEffect, useCallback, useState } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import { Image, Heading } from '@pancakeswap-libs/uikit'
import { BLOCKS_PER_YEAR, CAKE_PER_BLOCK, CAKE_POOL_PID } from 'config'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import listReactFiles from 'list-react-files'
import { useFarms, usePriceBnbBusd, usePriceCakeBusd } from 'state/hooks'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmUserDataAsync } from 'state/actions'
import { QuoteToken } from 'config/constants/types'
import useI18n from 'hooks/useI18n'
import FarmCard, { FarmWithStakedValue } from './components/FarmCard/FarmCard'
import FarmTabButtons from './components/FarmTabButtons'
import Divider from './components/Divider'

const fs = require('fs');


/* eslint @typescript-eslint/no-var-requires: "off" */



export interface FarmsProps{
  tokenMode?: boolean
}

const Memes: React.FC<FarmsProps> = (farmsProps) => {
  const { path } = useRouteMatch()
  const TranslateString = useI18n()
  const farmsLP = useFarms()
  const cakePrice = usePriceCakeBusd()
  const bnbPrice = usePriceBnbBusd()
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const {tokenMode} = farmsProps;

  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const [stakedOnly, setStakedOnly] = useState(false)
  const activeFarms = farmsLP.filter((farm) => !!farm.isTokenOnly === !!tokenMode && farm.multiplier !== '0X')
  const inactiveFarms = farmsLP.filter((farm) => !!farm.isTokenOnly === !!tokenMode && farm.multiplier === '0X')

  const stakedOnlyFarms = activeFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  // /!\ This function will be removed soon
  // This function compute the APY for each farm and will be replaced when we have a reliable API
  // to retrieve assets prices against USD
  const farmsList = useCallback(
    (farmsToDisplay, removed: boolean) => {
      // const cakePriceVsBNB = new BigNumber(farmsLP.find((farm) => farm.pid === CAKE_POOL_PID)?.tokenPriceVsQuote || 0)
      const farmsToDisplayWithAPY: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        // if (!farm.tokenAmount || !farm.lpTotalInQuoteToken || !farm.lpTotalInQuoteToken) {
        //   return farm
        // }
        const cakeRewardPerBlock = new BigNumber(farm.pamanPerBlock || 1).times(new BigNumber(farm.poolWeight)) .div(new BigNumber(10).pow(18))
        const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR)

        let apy = cakePrice.times(cakeRewardPerYear);

        let totalValue = new BigNumber(farm.lpTotalInQuoteToken || 0);

        if (farm.quoteTokenSymbol === QuoteToken.BNB) {
          totalValue = totalValue.times(bnbPrice);
        }

        if(totalValue.comparedTo(0) > 0){
          apy = apy.div(totalValue);
        }

        return { ...farm, apy }
      })
      return farmsToDisplayWithAPY.map((farm) => (
        <FarmCard
          key={farm.pid}
          farm={farm}
          removed={removed}
          bnbPrice={bnbPrice}
          cakePrice={cakePrice}
          ethereum={ethereum}
          account={account}
        />
      ))
    },
    [bnbPrice, account, cakePrice, ethereum],
  )

  	const warning = {
  		    backgroundColor: "rgba(100,0,0,0.55)",
		    borderRadius: "6px",
		    border: "1px solid rgba(200,0,0,0.55)",
		    marginBottom: "10px",
		    color: "white",
		    padding: "5px",
		    display: 'flex',
  	}

  	const margintop = {
  		marginTop: '18px'
  	}

    const memestyle = {
      maxWidth: '100%',
      borderRadius: '6px',
      boxShadow: '0 0 11px 1px rgba(0,0,0,0.25)',
      marginTop: '15px'
    }

    const memescontainer = {
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '100%',
      justifyContent: 'center',
      alignItems: 'center'
    }

    const downloadlink = {
      color: 'white', 
      fontSize: '2rem'
    }



  return (
    <Page>

     <div className="memes-container" style={memescontainer as React.CSSProperties} >
     <a href="memes.rar" style={downloadlink}>Click here to download the meme archive</a>
      <img style={memestyle} src="images/memes/abdullah.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/aditya.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/ai.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/aldo.png" alt="meme" />
      <img style={memestyle} src="images/memes/anargya.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/anjay.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/apimasapit.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/aq.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/archis.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/azam.png" alt="meme" />
      <img style={memestyle} src="images/memes/bart.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/chunkzrevenge.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/clow.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/criztyan.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/crypto emoto.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/daolicious2.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/daolicious.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/darmawan.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/drew eth.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/empress.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/federico.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/guillermo.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/guillermo2.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/guillermo3.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/hama.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/hanji.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/happydrop.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/hendry.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/hosann.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/itsanillusion.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/john brown.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/kang.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/linnwave.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/majorpenguin.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/meong.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/meowoem.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/mm.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/myway.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/nbah.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/nikolay.png" alt="meme" />
      <img style={memestyle} src="images/memes/nnusategl.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/no cap.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/npa.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/olaf.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/ongelma.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/phantomsaw.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/phantomsaw2.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/phantomsaw3.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/phantomsaw4.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/phantomsaw5.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/pilip fhe.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/ressa.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/ressa2.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/rizky.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/rob hwang.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/robinsar.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/sebastian.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/sigurd bjorge.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/suprihatin.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/type thing.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/uestace.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/yakinlah.jpg" alt="meme" />
      <img style={memestyle} src="images/memes/yang.jpg" alt="meme" />
      
     </div>
    </Page>
  )
}

export default Memes
