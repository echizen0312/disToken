<template>
    <div style="width: 100%; padding: 10px; max-width: 600px; margin: 0 auto;">
        <mu-card
                style="width: 100%; margin-bottom: 10px; text-align: left; position: relative;">
            <mu-card-title title="账户详情"></mu-card-title>
            <mu-divider></mu-divider>
            <mu-list>
                <mu-list-item button :ripple="false">
                    <mu-list-item-action>
                        <mu-icon value="person"></mu-icon>
                    </mu-list-item-action>
                    <mu-list-item-title>{{ account.name }}</mu-list-item-title>
                    <mu-list-item-action style="flex-direction: row; align-items: center;">
                        <mu-button icon color="info" @click="doCopy">
                            <mu-icon value="filter_none"></mu-icon>
                        </mu-button>
                    </mu-list-item-action>
                </mu-list-item>
                <mu-list-item button :ripple="false">
                    <mu-list-item-action>
                        <mu-icon value="linear_scale"></mu-icon>
                    </mu-list-item-action>
                    <mu-list-item-title>{{ account.netName }}</mu-list-item-title>
                    <mu-list-item-action style="flex-direction: row; align-items: center;">
                        <mu-button icon color="info" @click="doExport">
                            <mu-icon value="publish"></mu-icon>
                        </mu-button>
                    </mu-list-item-action>
                </mu-list-item>
            </mu-list>
        </mu-card>
        <mu-card
                style="width: 100%; margin-bottom: 10px; text-align: left; position: relative;">
            <mu-card-title title="代币余额" sub-title=""></mu-card-title>
            <mu-divider></mu-divider>
            <mu-list>
                <mu-list-item button :ripple="false">
                    <mu-list-item-action>
                        <mu-icon value="book"></mu-icon>
                    </mu-list-item-action>
                    <mu-list-item-title @click="goTransferList(sysToken)">{{ sysToken.balance }}</mu-list-item-title>
                    <mu-list-item-action style="flex-direction: row; align-items: center;">
                        <mu-list-item-after-text @click="goTransferList(sysToken)">{{ sysToken.name }}
                        </mu-list-item-after-text>
                        <mu-button icon color="error" @click="goTransfer(sysToken)">
                            <mu-icon value="swap_horiz"></mu-icon>
                        </mu-button>
                    </mu-list-item-action>
                </mu-list-item>
                <template v-for="(token, index) in userToken">
                    <mu-divider :key="token.account + token.name + index" inset></mu-divider>
                    <mu-list-item button :ripple="false" :key="token.account + token.name">
                        <mu-list-item-action>
                            <mu-icon value="style"></mu-icon>
                        </mu-list-item-action>
                        <mu-list-item-title @click="goTransferList(token)">{{ token.balance }}</mu-list-item-title>
                        <mu-list-item-action style="flex-direction: row; align-items: center;">
                            <mu-list-item-after-text @click="goTransferList(token)">{{ token.name }}
                            </mu-list-item-after-text>
                            <mu-button icon color="error" @click="goTransfer(token)">
                                <mu-icon value="swap_horiz"></mu-icon>
                            </mu-button>
                        </mu-list-item-action>
                    </mu-list-item>
                </template>
            </mu-list>
        </mu-card>
        <mu-card
                style="width: 100%; margin-bottom: 10px; text-align: left; position: relative;">
            <mu-card-title title="账户资源" sub-title=""></mu-card-title>
            <mu-divider></mu-divider>
            <mu-list>
                <mu-list-item button :ripple="false">
                    <mu-list-item-action>
                        <mu-icon value="sd_storage"></mu-icon>
                    </mu-list-item-action>
                    <mu-list-item-title>{{ account.ram.ram_usage }} / {{ account.ram.ram_quota }}</mu-list-item-title>
                    <mu-list-item-action>
                        <mu-list-item-after-text>RAM</mu-list-item-after-text>
                    </mu-list-item-action>
                </mu-list-item>
                <mu-divider inset></mu-divider>
                <mu-list-item button :ripple="false">
                    <mu-list-item-action>
                        <mu-icon value="memory"></mu-icon>
                    </mu-list-item-action>
                    <mu-list-item-title>{{ account.cpu.used }} / {{ account.cpu.max }}</mu-list-item-title>
                    <mu-list-item-action>
                        <mu-list-item-after-text>CPU</mu-list-item-after-text>
                    </mu-list-item-action>
                </mu-list-item>
                <mu-divider inset></mu-divider>
                <mu-list-item button :ripple="false">
                    <mu-list-item-action>
                        <mu-icon value="network_check"></mu-icon>
                    </mu-list-item-action>
                    <mu-list-item-title>{{ account.net.used }} / {{ account.net.max }}</mu-list-item-title>
                    <mu-list-item-action>
                        <mu-list-item-after-text>NET</mu-list-item-after-text>
                    </mu-list-item-action>
                </mu-list-item>
            </mu-list>
        </mu-card>
    </div>
</template>

<script>
    /* eslint-disable no-undef */

    let Eos = require('eosjs')
    // let ecc = require('eosjs-ecc')
    let CryptoJS = require("crypto-js")
    export default {
        name: 'Account',
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
                config: null,
                sysToken: {},
                userToken: [],
                canQRPay: false
            }
        },
        created: function () {
            let self = this
            // self.$emit('setTop', {title: 'DisToken', back: true, add: false, qr: true, path: '1'})
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
                self.config = configObj.config
                self.sysToken = configObj.sysToken
                self.userToken = configObj.userToken
                self.canQRPay = configObj.canQRPay
                self.$emit('setTop', {title: 'DisToken', back: true, add: false, qr: self.canQRPay, path: '1'})
                self.getAccount(self.account)
                self.getSysBalance()
                self.getUserBalance()
            }
        },
        methods: {
            getByteSize: function (net) {
                let len = 2
                let s = ''
                if (net < 1024) {
                    s = net.toFixed(len).toString() + 'B'
                } else {
                    net /= 1024
                    if (net < 1024) {
                        s = net.toFixed(len).toString() + 'KB'
                    } else {
                        net /= 1024
                        if (net < 1024) {
                            s = net.toFixed(len).toString() + 'MB'
                        } else {
                            net /= 1024
                            if (net < 1024) {
                                s = net.toFixed(len).toString() + 'GB'
                            } else {
                                net /= 1024
                                s = net.toFixed(len).toString() + 'TB'
                            }
                        }
                    }
                }
                return s
            },
            getTimeSize: function (net) {
                let len = 2
                let s = ''
                if (net < 1000) {
                    s = net.toFixed(len).toString() + 'ns'
                } else {
                    net /= 1000
                    if (net < 1000) {
                        s = net.toFixed(len).toString() + 'ms'
                    } else {
                        net /= 1000
                        if (net < 60) {
                            s = net.toFixed(len).toString() + 'sec'
                        } else {
                            net /= 60
                            if (net < 60) {
                                s = net.toFixed(len).toString() + 'min'
                            } else {
                                net /= 60
                                s = net.toFixed(len).toString() + 'hr'
                            }
                        }
                    }
                }
                return s
            },
            getAccount: function (acc) {
                let self = this
                let config = self.config
                config.keyProvider = acc.key
                let eos = Eos(config)
                eos.getAccount({
                    account_name: acc.name
                }).then(result => {
                    // cpu
                    let cpu = {
                        max: self.getTimeSize(Number.parseFloat(result.cpu_limit.max)),
                        available: self.getTimeSize(Number.parseFloat(result.cpu_limit.available)),
                        used: self.getTimeSize(Number.parseFloat(result.cpu_limit.used))
                    }
                    // net
                    let net = {
                        max: self.getByteSize(Number.parseFloat(result.net_limit.max)),
                        available: self.getByteSize(Number.parseFloat(result.net_limit.available)),
                        used: self.getByteSize(Number.parseFloat(result.net_limit.used))
                    }
                    // ram
                    let ram = {
                        ram_quota: self.getByteSize(result.ram_quota),
                        ram_usage: self.getByteSize(result.ram_usage)
                    }
                    acc.ram = ram
                    acc.net = net
                    acc.cpu = cpu
                    self.account = acc
                }).catch(error => {
                    console.log(error)
                })
            },
            doCopy: function () {
                let self = this
                self.$copyText(self.account.name).then(function () {
                    self.$alert('复制成功', '提示', {type: 'success'})
                }, function () {
                    self.$alert('复制失败', '提示', {type: 'error'})
                })
            },
            doExport: function () {
                let self = this
                self.$prompt('请输入交易密码', '导出私钥', {inputType: 'password'}).then(data => {
                    if (data.result && data.value != undefined && data.value != '') {
                        let bytes = CryptoJS.AES.decrypt(self.account.key, data.value)
                        let plaintext = bytes.toString(CryptoJS.enc.Utf8)
                        // console.log(plaintext)
                        if (plaintext != '') {
                            self.$copyText(plaintext).then(function () {
                                self.$alert('成功导出私钥到剪贴板', '提示', {type: 'success'})
                            }, function () {
                                self.$alert('导出私钥失败', '提示', {type: 'error'})
                            })
                        } else {
                            self.$alert('交易密码错误', '提示', {type: 'error'})
                        }
                    }
                }).catch(e => {
                    console.log(e)
                })
            },
            getSysBalance: function () {
                let self = this
                let config = self.config
                config.keyProvider = self.account.key
                let eos = Eos(config)
                eos.getCurrencyBalance({
                    code: self.sysToken.account,
                    account: self.account.name,
                    symbol: self.sysToken.name
                }).then(result => {
                    if (result.length === 0) {
                        self.sysToken.balance = 0
                    } else {
                        self.sysToken.balance = Number.parseFloat(result[0].split(' EOS')[0])
                    }
                }).catch(error => {
                    console.log(error)
                    self.sysToken.balance = 0
                })
            },
            getUserBalance: function () {
                let self = this
                let config = self.config
                config.keyProvider = self.account.key
                let eos = Eos(config)
                for (let i in self.userToken) {
                    let token = self.userToken[i]
                    eos.getCurrencyBalance({
                        code: token.account,
                        account: self.account.name,
                        symbol: token.name
                    }).then(result => {
                        if (result.length === 0) {
                            token.balance = 0
                        } else {
                            token.balance = Number.parseFloat(result[0].split(` ${token.name}`)[0])
                        }
                    }).catch(error => {
                        console.log(error)
                        token.balance = 0
                    })
                }
            },
            goTransfer: function (token) {
                this.$router.push('/Transfer/' + this.account_id + '/' + token.name)
            },
            goTransferList: function (token) {
                this.$router.push('/TransferList/' + this.account_id + '/' + token.name)
            },
            qrClick: function () {
                this.$router.push('/QrCode/' + this.account_id)
            }
        }
    }
</script>

<style scoped>

</style>
