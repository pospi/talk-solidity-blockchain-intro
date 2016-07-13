#!/usr/bin/env bash
#
# Clone some stuff using git.
# If you don't have git installed, this won't work.
#
# @package: Solidity intro talk
# @author:  pospi <pospi@spadgos.com>
# @since:   2016-07-13
#
##

pushd examples
    git clone git@github.com:Arachnid/ens.git
    git clone git@github.com:Arachnid/solidity-stringutils.git
    git clone git@github.com:axic/density.git
    git clone git@github.com:axic/etherboard.git
    git clone git@github.com:axic/shapeshiftbot.git
    git clone git@github.com:chriseth/solidity-examples.git
    git clone git@github.com:dadaista/bitshelter.git
    git clone git@github.com:emailgregn/contracts.git
    git clone git@github.com:ethereum/dapp-bin.git
    git clone git@github.com:fivedogit/solidity-baby-steps/.git
    git clone git@github.com:FrankHold/DApp_SyntheticTrader.git
    git clone git@github.com:iudex/iudex.git
    git clone git@github.com:JeffreyBPetersen/contract-testing.git
    git clone git@github.com:JeffreyBPetersen/data-sharing-contracts.git
    git clone git@github.com:nexusdev/dappsys.git
    git clone git@github.com:nickfranklinuk/canary.git
    git clone git@github.com:phillyfan1138/DArtist.git
    git clone git@github.com:smartcontractproduction/dao.git
    git clone git@github.com:zmitton/ethereum_escrow.git
popd
