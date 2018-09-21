<template>
    <div style="width: 100%; padding: 10px; max-width: 600px; margin: 0 auto;">
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
                    <mu-tab>全部</mu-tab>
                    <mu-tab>转出</mu-tab>
                    <mu-tab>转入</mu-tab>
                </mu-tabs>
                <div v-if="active1 === 0">
                    <mu-list v-loading="loading3" data-mu-loading-size="24">
                        <template v-for="(transfer, index) in allList">
                            <mu-divider :key="transfer.trx_id" v-if="index > 0"></mu-divider>
                            <mu-list-item button :ripple="false" :key="transfer.trx_id + index"
                                          @click="showTransferInfo(transfer)">
                                <mu-list-item-action>
                                    <mu-icon value="unarchive" color="orange800"
                                             v-if="transfer.data.from == account.name"></mu-icon>
                                    <mu-icon value="archive" color="green600" v-else></mu-icon>
                                </mu-list-item-action>
                                <!--<mu-list-item-content>-->
                                <div style="flex: 1; display: flex; flex-direction: row;">
                                    <mu-list-item-title v-if="transfer.data.from == account.name">{{ transfer.data.to
                                        }}
                                    </mu-list-item-title>
                                    <mu-list-item-title v-else>{{ transfer.data.from }}</mu-list-item-title>
                                    <mu-list-item-sub-title style="text-align: right;">{{ transfer.data.quantity }}
                                    </mu-list-item-sub-title>
                                </div>
                                <!--</mu-list-item-content>-->
                            </mu-list-item>
                        </template>
                        <mu-list-item button :ripple="false" v-if="allList.length == 0">
                            <mu-list-item-title style="text-align: center; margin-top: 8px;">没有记录</mu-list-item-title>
                        </mu-list-item>
                    </mu-list>
                </div>
                <div v-if="active1 === 1">
                    <mu-list v-loading="loading1" data-mu-loading-size="24">
                        <template v-for="(transfer, index) in outList">
                            <mu-divider :key="transfer.trx_id" v-if="index > 0"></mu-divider>
                            <mu-list-item button :ripple="false" :key="transfer.trx_id + index"
                                          @click="showTransferInfo(transfer)">
                                <mu-list-item-action>
                                    <mu-icon value="unarchive" color="orange800"></mu-icon>
                                </mu-list-item-action>
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
                <div v-if="active1 === 2">
                    <mu-list v-loading="loading2" data-mu-loading-size="24">
                        <template v-for="(transfer, index) in inList">
                            <mu-divider :key="transfer.trx_id" v-if="index > 0"></mu-divider>
                            <mu-list-item button :ripple="false" :key="transfer.trx_id + index"
                                          @click="showTransferInfo(transfer)">
                                <mu-list-item-action>
                                    <mu-icon value="archive" color="green600"></mu-icon>
                                </mu-list-item-action>
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
        <mu-dialog title="转账详情" width="600" max-width="80%" :esc-press-close="false"
                   :overlay-close="false" :open.sync="openAlert">
            <mu-list style="padding: 0;">
                <mu-list-item button :ripple="false" @click="goTracker(nowData.trx_id)">
                    <mu-list-item-action>
                        trx_id
                    </mu-list-item-action>
                    <mu-list-item-title style="text-align: right;">{{ nowData.trx_id }}</mu-list-item-title>
                </mu-list-item>
                <mu-divider></mu-divider>
                <mu-list-item button :ripple="false">
                    <mu-list-item-action>
                        from
                    </mu-list-item-action>
                    <mu-list-item-title style="text-align: right;">{{ nowData.from }}</mu-list-item-title>
                </mu-list-item>
                <mu-divider></mu-divider>
                <mu-list-item button :ripple="false">
                    <mu-list-item-action>
                        to
                    </mu-list-item-action>
                    <mu-list-item-title style="text-align: right;">{{ nowData.to }}</mu-list-item-title>
                </mu-list-item>
                <mu-divider></mu-divider>
                <mu-list-item button :ripple="false">
                    <mu-list-item-action>
                        quantity
                    </mu-list-item-action>
                    <mu-list-item-title style="text-align: right;">{{ nowData.quantity }}</mu-list-item-title>
                </mu-list-item>
                <mu-divider></mu-divider>
                <mu-list-item button :ripple="false">
                    <mu-list-item-action>
                        time
                    </mu-list-item-action>
                    <mu-list-item-title style="text-align: right;">{{ GetMoment(nowData.time) }}</mu-list-item-title>
                </mu-list-item>
                <mu-divider></mu-divider>
            </mu-list>
            <div style="display: flex; flex-direction: row;">
                <div style="width: 56px; height: 48px; line-height: 48px; margin-left: 16px;">memo</div>
                <div style="flex: 1; padding-top: 13px; margin-left: 24px; margin-right: 16px; text-align: right; line-height: 22px; word-break:break-all; word-wrap:break-word;">
                    {{ nowData.memo }}
                </div>
            </div>
            <mu-button slot="actions" flat color="primary" @click="closeTransferInfo">关闭</mu-button>
        </mu-dialog>
    </div>
</template>

<script>
    /* eslint-disable no-undef */
    import * as moment from 'moment'

    export default {
        name: 'TransferList',
        data() {
            return {
                configList: configList,
                account_id: null,
                account: {
                    id: 0,
                    name: '',
                    netName: '',
                    key: '',
                    ram: {
                        ram_quota: '0',
                        ram_usage: '0'
                    },
                    cpu: {
                        max: '0',
                        available: '0',
                        used: '0'
                    },
                    net: {
                        max: '0',
                        available: '0',
                        used: '0'
                    }
                },
                dbAddress: '',
                trackerAddress: '',
                active1: 0,
                token_name: null,
                sysToken: {},
                userToken: [],
                nowToken: {
                    account: 'eosio.token',
                    name: 'TOK',
                    balance: 0,
                    isSys: true
                },
                outList: [],
                inList: [],
                allList: [],
                loading1: false,
                loading2: false,
                loading3: false,
                openAlert: false,
                nowData: {
                    from: '',
                    to: '',
                    quantity: '',
                    memo: ''
                }
            }
        },
        created: function () {
            let self = this
            self.$emit('setTop', {title: 'DisToken', back: true, add: false, path: '1'})
            self.account_id = self.$route.params.id
            self.account = null
            let hasAccs = self.$cookies.isKey('disTokenAccounts')
            if (hasAccs) {
                let tmp = JSON.parse(self.$cookies.get('disTokenAccounts'))
                for (let i in tmp) {
                    if (tmp[i].id == self.account_id) {
                        self.account = tmp[i]
                    }
                }
            }
            if (self.account != null) {
                let configObj = self.configList[self.account.netName]
                self.dbAddress = configObj.dbAddress
                self.trackerAddress = configObj.trackerAddress
                self.sysToken = configObj.sysToken
                self.userToken = configObj.userToken
                self.token_name = self.$route.params.token
                if (self.token_name == self.sysToken.name) {
                    self.nowToken = self.sysToken
                }
                for (let i in self.userToken) {
                    if (self.userToken[i].name == self.token_name) {
                        self.nowToken = self.userToken[i]
                    }
                }
                self.getAccountTransfersAll()
            }
        },
        methods: {
            GetMoment: function (date) {
                return moment(date).format('YYYY-MM-DD HH:mm:ss')
            },
            change: function (value) {
                let self = this
                if (value == 1) {
                    self.getAccountTransfersOut()
                }
                if (value == 2) {
                    self.getAccountTransfersIn()
                }
                if (value == 0) {
                    self.getAccountTransfersAll()
                }
            },
            getAccountTransfersOut: function () {
                let self = this
                let direction = 'out'
                self.loading1 = true
                self.$http.get(`${self.dbAddress}/eosSak/db/GetAccountTransfers?account_name=${self.account.name}&direction=${direction}&code=${self.nowToken.account}&symbol=${self.nowToken.name}`, {}).then(res => {
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
                self.$http.get(`${self.dbAddress}/eosSak/db/GetAccountTransfers?account_name=${self.account.name}&direction=${direction}&code=${self.nowToken.account}&symbol=${self.nowToken.name}`, {}).then(res => {
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
            getAccountTransfersAll: function () {
                let self = this
                let direction = 'all'
                self.loading3 = true
                self.$http.get(`${self.dbAddress}/eosSak/db/GetAccountTransfers?account_name=${self.account.name}&direction=${direction}&code=${self.nowToken.account}&symbol=${self.nowToken.name}`, {}).then(res => {
                    let data = res.data
                    if (data.result.length > 0) {
                        self.allList = data.result
                    } else {
                        self.allList = []
                    }
                    self.loading3 = false
                }, res => {
                    self.loading3 = false
                    console.log(res)
                })
            },
            showTransferInfo: function (trx) {
                this.nowData = trx.data
                this.nowData.time = trx.time
                this.nowData.trx_id = trx.trx_id
                this.openAlert = true
            },
            closeTransferInfo: function () {
                this.openAlert = false
            },
            goTransfer: function () {
                this.$router.push('/Transfer/' + this.account.id + '/' + this.token_name)
            },
            goTracker: function (trx_id) {
                window.open(this.trackerAddress + '' + trx_id)
            }
        }
    }
</script>

<style scoped>

</style>
