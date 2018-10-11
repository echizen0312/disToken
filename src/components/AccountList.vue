<template>
    <div style="width: 100%; padding: 10px; max-width: 600px; margin: 0 auto;">
        <mu-list textline="two-line">
            <mu-sub-header style="text-align: left;">账户列表</mu-sub-header>
            <mu-divider></mu-divider>
            <template v-for="(account, index) in accounts">
                <mu-list-item avatar :ripple="false" button :key="account.name + index">
                    <mu-list-item-action @click="accountClick(account)">
                        <mu-avatar :color="configList[account.netName].color">
                            <mu-icon :value="configList[account.netName].logo"></mu-icon>
                        </mu-avatar>
                    </mu-list-item-action>
                    <mu-list-item-content @click="accountClick(account)">
                        <mu-list-item-title style="font-size: 19px;margin-bottom: 2px;">{{ account.name }}
                        </mu-list-item-title>
                        <mu-list-item-sub-title style="font-size: 12px;"><span style="color: #e65100;">{{ account.netName }}</span>
                            账户
                        </mu-list-item-sub-title>
                    </mu-list-item-content>
                    <mu-list-item-action>
                        <mu-button icon color="red500" @click.stop="confirm(account)">
                            <mu-icon value="close"></mu-icon>
                        </mu-button>
                    </mu-list-item-action>
                </mu-list-item>
                <mu-divider :key="index"></mu-divider>
            </template>
        </mu-list>
        <!--<div v-for="(account, index) in accounts" :key="account.key + index" style=" display: none;"/>-->
        <mu-dialog title="导入明文私钥" width="600" max-width="80%" :esc-press-close="false"
                   :overlay-close="false" :open.sync="openAlert">
            <mu-form :model="form" label-width="80">
                <mu-form-item prop="input" label="目标链">
                    <mu-select v-model="form.netName" full-width>
                        <mu-option v-for="configObj in configList" :key="configObj.name"
                                   :label="configObj.name"
                                   :value="configObj.name"></mu-option>
                    </mu-select>
                </mu-form-item>
                <mu-form-item prop="input" label="明文私钥">
                    <mu-text-field v-model="form.privateKey"></mu-text-field>
                </mu-form-item>
                <mu-form-item prop="input" label="交易密码">
                    <mu-text-field v-model="form.aesKey" type="password"></mu-text-field>
                </mu-form-item>
            </mu-form>
            <mu-button slot="actions" flat color="primary" @click="closeAlertDialog" style="margin-right: 8px;">关闭
            </mu-button>
            <mu-button slot="actions" color="primary" @click="submitAlertDialog">确定</mu-button>
        </mu-dialog>
    </div>
</template>

<script>
    /* eslint-disable no-undef */

    let Eos = require('eosjs')
    let ecc = require('eosjs-ecc')
    let CryptoJS = require("crypto-js")
    export default {
        name: 'AccountList',
        data() {
            return {
                configList: configList,
                accounts: [],
                openAlert: false,
                form: {
                    netName: '',
                    privateKey: '',
                    aesKey: ''
                }
            }
        },
        created: function () {
            let self = this
            self.$emit('setTop', {title: 'DisToken', back: false, add: true, qr: false, path: '1'});
            let hasAccs = self.$cookies.isKey('disTokenAccounts')
            if (hasAccs) {
                let oldTmp = self.$cookies.get('disTokenAccounts')
                self.$cookies.set('disTokenAccounts', oldTmp, '15d')
                let tmp = JSON.parse(oldTmp)
                for (let i in tmp) {
                    self.accounts.push(tmp[i])
                    // self.accountsC.push(tmp[i])
                }
            }
            if (self.accounts.length == 0) {
                // self.openAlert = true
            }
            // if (self.accountsC.length == 0) {
            //     self.openAlert = true
            // }
        },
        methods: {
            addClick: function () {
                this.openAlert = true
                this.form.netName = ''
                this.form.privateKey = ''
                this.form.aesKey = ''
            },
            closeAlertDialog: function () {
                this.openAlert = false
            },
            submitAlertDialog: function () {
                this.getAccountNameFromKey()
            },
            accountClick: function (acc) {
                let self = this
                self.nowAccount = acc
                if (self.nowAccount != null) {
                    // console.log(acc)
                    this.$router.push('/Account/' + acc.id)
                }
            },
            getAccountNameFromKey: function () {
                let self = this
                if (self.form.netName != '' && self.form.privateKey != '' && self.form.aesKey != '') {
                    let config = self.configList[self.form.netName].config
                    let eos = Eos(config)
                    let key = self.form.privateKey
                    let pub = ecc.privateToPublic(key)
                    let ciphertext = CryptoJS.AES.encrypt(key, self.form.aesKey);
                    let aesR = ciphertext.toString()
                    let acc = {
                        id: new Date().getTime(),
                        name: '',
                        netName: self.form.netName,
                        key: aesR,
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
                    }
                    eos.getKeyAccounts({
                        public_key: pub
                    }).then(result => {
                        let ss = result.account_names
                        if (ss !== undefined && ss.length === 1) {
                            acc.name = ss[0]
                            self.accounts.push(acc)
                            // self.accountsC.push(acc)
                            self.$cookies.set('disTokenAccounts', JSON.stringify(self.accounts), '15d')
                            // self.$cookies.set('disTokenAccounts', JSON.stringify(self.accountsC))
                        } else {
                            alert('秘钥可能不正确')
                        }
                        self.openAlert = false
                    }).catch(error => {
                        console.log(error)
                    })
                    /*
                    test
                    */
                    // acc.name = 'sunny1sakuya'
                    // self.accounts.push(acc)
                    // self.$cookies.set('disTokenAccounts', JSON.stringify(self.accounts))
                }
            },
            confirm: function (acc) {
                let self = this
                self.$confirm('确定要删除？', '提示', {
                    type: 'warning'
                }).then(({result}) => {
                    if (result) {
                        self.removeAccount(acc)
                    }
                })
            },
            removeAccount: function (acc) {
                let self = this
                for (let i in self.accounts) {
                    let obj = self.accounts[i]
                    if (obj.name === acc.name) {
                        self.accounts.splice(i, 1)
                    }
                }
                // for (let i in self.accountsC) {
                //     let obj = self.accountsC[i]
                //     if (obj.name === acc.name) {
                //         self.accountsC.splice(i, 1)
                //     }
                // }
                self.nowAccount = null
                self.$cookies.set('disTokenAccounts', JSON.stringify(self.accounts))
                // self.$cookies.set('disTokenAccounts', JSON.stringify(self.accountsC))
            }
        }
    }
</script>

<style scoped>

</style>
