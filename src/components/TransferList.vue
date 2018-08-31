<template>
    <div style="width: 100%; padding: 10px; max-width: 450px; margin: 0 auto;">
        <mu-button fab color="red" style="position: fixed; bottom: 75px; right: 20px; z-index: 999;"
                   @click="goTransfer">
            <mu-icon value="swap_horiz"></mu-icon>
        </mu-button>
        <mu-card
                style="width: 100%; margin-bottom: 80px; text-align: left; position: relative;">
            <mu-card-title :title="token_name + ' 转账记录（近10条）'"></mu-card-title>
            <mu-divider></mu-divider>
            <div style="padding: 10px 15px 5px 15px; ">
                <mu-tabs :value.sync="active1" inverse color="secondary" text-color="rgba(0, 0, 0, .54)" full-width
                         @change="change">
                    <mu-tab>转出</mu-tab>
                    <mu-tab>转入</mu-tab>
                </mu-tabs>
                <div v-if="active1 === 0">
                    <mu-list v-loading="loading1" data-mu-loading-size="24">
                        <template v-for="(transfer, index) in outList">
                            <mu-divider :key="transfer.trx_id" v-if="index > 0"></mu-divider>
                            <mu-list-item button :ripple="false" :key="transfer.trx_id + index">
                                <!--<mu-list-item-content>-->
                                <div style="flex: 1; display: flex; flex-direction: row;">
                                    <mu-list-item-title>{{ transfer.data.to }}</mu-list-item-title>
                                    <mu-list-item-sub-title style="text-align: right;">{{ transfer.data.quantity }}
                                    </mu-list-item-sub-title>
                                </div>
                                <!--</mu-list-item-content>-->
                            </mu-list-item>
                        </template>
                        <mu-list-item button :ripple="false" v-if="outList.length == 0">
                            <mu-list-item-title style="text-align: center; margin-top: 8px;">没有记录</mu-list-item-title>
                        </mu-list-item>
                    </mu-list>
                </div>
                <div v-if="active1 === 1">
                    <mu-list v-loading="loading2" data-mu-loading-size="24">
                        <template v-for="(transfer, index) in inList">
                            <mu-divider :key="transfer.trx_id" v-if="index > 0"></mu-divider>
                            <mu-list-item button :ripple="false" :key="transfer.trx_id + index">
                                <!--<mu-list-item-content>-->
                                <div style="flex: 1; display: flex; flex-direction: row;">
                                    <mu-list-item-title>{{ transfer.data.from }}</mu-list-item-title>
                                    <mu-list-item-sub-title style="text-align: right;">{{ transfer.data.quantity }}
                                    </mu-list-item-sub-title>
                                </div>
                                <!--</mu-list-item-content>-->
                            </mu-list-item>
                        </template>
                        <mu-list-item button :ripple="false" v-if="inList.length == 0">
                            <mu-list-item-title style="text-align: center; margin-top: 8px;">没有记录</mu-list-item-title>
                        </mu-list-item>
                    </mu-list>
                </div>
            </div>
        </mu-card>
    </div>
</template>

<script>
    /* eslint-disable no-undef */

    export default {
        name: 'TransferList',
        data() {
            return {
                config: config,
                dbAddress: dbAddress,
                active1: 0,
                account_name: null,
                token_name: null,
                sysToken: sysToken,
                userToken: userToken,
                nowToken: {
                    account: 'eosio.token',
                    name: 'TOK',
                    balance: 0,
                    isSys: true
                },
                outList: [],
                inList: [],
                loading1: false,
                loading2: false
            }
        },
        created: function () {
            let self = this
            self.$emit('setTop', {title: 'DisToken', back: true, add: false})
            self.account_name = self.$route.params.name
            self.token_name = self.$route.params.token
            if (self.token_name == self.sysToken.name) {
                self.nowToken = self.sysToken
            }
            for (let i in userToken) {
                if (userToken[i].name == self.token_name) {
                    self.nowToken = userToken[i]
                }
            }
            self.getAccountTransfersOut()
        },
        methods: {
            change: function (value) {
                let self = this
                if (value == 0) {
                    self.getAccountTransfersOut()
                }
                if (value == 1) {
                    self.getAccountTransfersIn()
                }
            },
            getAccountTransfersOut: function () {
                let self = this
                let direction = 'out'
                self.loading1 = true
                self.$http.get(`${self.dbAddress}/eosSak/db/GetAccountTransfers?account_name=${self.account_name}&direction=${direction}&code=${self.nowToken.account}&symbol=${self.nowToken.name}`, {}).then(res => {
                    let data = res.data
                    if (data.result.length > 0) {
                        self.outList = data.result
                    } else {
                        self.outList = []
                    }
                    self.loading1 = false
                }, res => {
                    console.log(res)
                    self.loading1 = false
                })
            },
            getAccountTransfersIn: function () {
                let self = this
                let direction = 'in'
                self.loading2 = true
                self.$http.get(`${self.dbAddress}/eosSak/db/GetAccountTransfers?account_name=${self.account_name}&direction=${direction}&code=${self.nowToken.account}&symbol=${self.nowToken.name}`, {}).then(res => {
                    let data = res.data
                    if (data.result.length > 0) {
                        self.inList = data.result
                    } else {
                        self.inList = []
                    }
                    self.loading2 = false
                }, res => {
                    self.loading2 = false
                    console.log(res)
                })
            },
            goTransfer: function () {
                this.$router.push('/Transfer/' + this.account_name + '/' + this.token_name)
            },
        }
    }
</script>

<style scoped>

</style>
