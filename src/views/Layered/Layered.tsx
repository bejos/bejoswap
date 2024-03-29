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

const Layered: React.FC<FarmsProps> = (farmsProps) => {
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
  const layer1Farms = farmsLP.filter((farm) => farm.isLayer1)
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
     <div className="layered-container" style={memescontainer as React.CSSProperties} >
      <div className="layered">
      <Heading as="h2" color="secondary" mb="50px" style={{ textAlign: 'center' }}>
        Use PAMAN to farm LM1 Tokens. 20% of deposit will be burned
      </Heading>
        <div>
          <Divider style={margintop}/>
          <FlexLayout>
            <Route exact path={`${path}`}>
              {farmsList(layer1Farms, false)}
            </Route>
            <Route exact path={`${path}/history`}>
              {farmsList(inactiveFarms, true)}
            </Route>
          </FlexLayout>
        </div>
      </div>
     </div>
    </Page>
  )
}

export default Layered
